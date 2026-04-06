import "dotenv/config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { stripePlugin } from "@payloadcms/plugin-stripe";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import type Stripe from "stripe";

import { Boxes } from "./src/collections/Boxes";
import { CiderStyles } from "./src/collections/CiderStyles";
import { Ciders } from "./src/collections/Ciders";
import { Media } from "./src/collections/Media";
import { Orders } from "./src/collections/Orders";
import { Users } from "./src/collections/Users";
import { AboutPage } from "./src/globals/AboutPage";
import { ContactPage } from "./src/globals/ContactPage";
import { HomePage } from "./src/globals/HomePage";
import { SiteSettings } from "./src/globals/SiteSettings";
import { isShopEnabled } from "./src/lib/feature-flags";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const stripeSecret = process.env.STRIPE_SECRET_KEY;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, CiderStyles, Ciders, Boxes, Orders],
  globals: [SiteSettings, HomePage, AboutPage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    /**
     * When true (dev only), Payload runs Drizzle `push` on connect. That can open **interactive**
     * prompts (e.g. rename vs create column) which **block** the DB adapter — then Next.js waits
     * tens of seconds per request. Keep off unless you are intentionally syncing schema in a TTY.
     * Use `npm run migrate:create` + `npm run migrate` instead.
     */
    push: process.env.PAYLOAD_DATABASE_PUSH === "true",
  }),
  sharp,
  plugins: [
    ...(stripeSecret && isShopEnabled()
      ? [
          stripePlugin({
            stripeSecretKey: stripeSecret,
            stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
            webhooks: {
              "checkout.session.completed": async ({ event, payload }) => {
                const session = event.data.object as Stripe.Checkout.Session;
                const sessionId = session.id;
                const existing = await payload.find({
                  collection: "orders",
                  where: { stripeCheckoutSessionId: { equals: sessionId } },
                  limit: 1,
                });
                if (existing.docs.length > 0) return;

                let lineItems: Record<string, unknown>[] = [];
                try {
                  const raw = session.metadata?.lineItemsJson;
                  if (raw) {
                    const parsed = JSON.parse(raw) as unknown;
                    lineItems = Array.isArray(parsed)
                      ? (parsed as Record<string, unknown>[])
                      : [];
                  }
                } catch {
                  lineItems = [];
                }

                await payload.create({
                  collection: "orders",
                  data: {
                    stripeCheckoutSessionId: sessionId,
                    status: "paid",
                    customerEmail:
                      session.customer_details?.email || session.customer_email || undefined,
                    amountTotalCents: session.amount_total ?? 0,
                    currency: session.currency || "eur",
                    lineItems: lineItems as unknown as Record<string, unknown>,
                  },
                  overrideAccess: true,
                });
              },
            },
          }),
        ]
      : []),
  ],
});
