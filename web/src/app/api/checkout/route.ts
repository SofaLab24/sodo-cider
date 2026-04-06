import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { isShopEnabled } from "@/lib/feature-flags";
import Stripe from "stripe";

export const runtime = "nodejs";

type CheckoutLine = { slug: string; quantity: number };

export async function POST(req: Request) {
  if (!isShopEnabled()) {
    return NextResponse.json({ error: "Shop is disabled." }, { status: 404 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  let body: { lines?: CheckoutLine[] };
  try {
    body = (await req.json()) as { lines?: CheckoutLine[] };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lines = (body.lines ?? []).filter((l) => l.quantity > 0);
  if (lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2022-08-01",
  });
  const payload = await getPayload({ config });
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || new URL(req.url).origin;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: Array<{
    slug: string;
    title: string;
    quantity: number;
    unitAmountCents: number;
  }> = [];

  for (const line of lines) {
    const found = await payload.find({
      collection: "boxes",
      where: { slug: { equals: line.slug } },
      limit: 1,
    });
    const doc = found.docs[0] as
      | { title?: string; inStock?: boolean; stripePriceId?: string; priceEur?: number }
      | undefined;
    if (!doc) {
      return NextResponse.json(
        {
          error: `Box "${line.slug}" was not found in the database. Clear the cart and add items again from the shop (slugs must match Payload).`,
        },
        { status: 400 },
      );
    }
    if (!doc.inStock) {
      return NextResponse.json({ error: `Item unavailable: ${line.slug}` }, { status: 400 });
    }
    const priceId = typeof doc.stripePriceId === "string" ? doc.stripePriceId.trim() : "";
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe Price ID in admin (field "Stripe Price ID (not Product ID)"): ${line.slug}` },
        { status: 400 },
      );
    }
    if (priceId.startsWith("prod_")) {
      return NextResponse.json(
        {
          error:
            "Stripe expects a Price ID (starts with price_), not a Product ID (prod_). Stripe Dashboard → Products → open the product → Pricing → copy the price API ID.",
        },
        { status: 400 },
      );
    }
    if (!priceId.startsWith("price_")) {
      return NextResponse.json(
        {
          error: `Unrecognised Stripe Price ID: must start with "price_". Got: "${priceId.slice(0, 16)}…"`,
        },
        { status: 400 },
      );
    }
    lineItems.push({ price: priceId, quantity: line.quantity });
    summary.push({
      slug: line.slug,
      title: String(doc.title ?? line.slug),
      quantity: line.quantity,
      unitAmountCents: Math.round(Number(doc.priceEur ?? 0) * 100),
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/cart?paid=1`,
      cancel_url: `${baseUrl}/cart?cancelled=1`,
      customer_creation: "always",
      metadata: {
        lineItemsJson: JSON.stringify(summary),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not create checkout link." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Unknown Stripe error.";
    return NextResponse.json(
      {
        error: `${message} — check: test \`sk_test_…\` with a test price, price currency EUR, one-time price (not subscription).`,
      },
      { status: 502 },
    );
  }
}
