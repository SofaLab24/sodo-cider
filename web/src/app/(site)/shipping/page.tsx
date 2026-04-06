import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-globals";
import { pageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleShipping,
    metaDescription: settings.metaDescriptionShipping,
    titleSegmentFallback: "Shipping & returns",
    descriptionFallback: "Shipping and returns — Sodo Sidrinė.",
  });
}

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark">Shipping & returns</h1>
      <p className="mt-4 text-sm text-orchard/70">
        Replace with real lead times, couriers, and prices once logistics are defined.
      </p>
      <div className="mt-10 space-y-6 text-orchard/85">
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Shipping zones</h2>
          <p className="mt-2">Lithuania (list cities, parcel lockers, or couriers).</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Timelines</h2>
          <p className="mt-2">Preparation and dispatch within X business days.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Returns</h2>
          <p className="mt-2">
            Food and beverage returns follow applicable law — confirm wording with a specialist.
          </p>
        </section>
      </div>
    </div>
  );
}
