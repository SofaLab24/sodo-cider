import type { Metadata } from "next";
import { Suspense } from "react";
import { CartContents } from "@/components/shop/CartContents";
import { getSiteSettings } from "@/lib/cms-globals";
import { pageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleCart,
    metaDescription: settings.metaDescriptionCart,
    titleSegmentFallback: "Cart",
    descriptionFallback: "Your order cart — Sodo Sidrinė.",
  });
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark">Cart</h1>
      <p className="mt-2 text-sm text-orchard/70">
        Your cart is stored in the browser. Checkout uses Stripe Checkout (configure STRIPE_SECRET_KEY
        and each box&apos;s Stripe Price ID in the admin).
      </p>
      <Suspense fallback={<p className="mt-8 text-sm text-orchard/70">Loading…</p>}>
        <CartContents />
      </Suspense>
    </div>
  );
}
