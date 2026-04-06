import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-globals";
import { pageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleTerms,
    metaDescription: settings.metaDescriptionTerms,
    titleSegmentFallback: "Terms of purchase",
    descriptionFallback: "Terms of purchase — Sodo Sidrinė.",
  });
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark">Terms of purchase</h1>
      <p className="mt-4 text-sm text-orchard/70">
        Template — add return windows, liability for shipping, and alcohol sale rules according to
        Lithuanian law and your lawyer&apos;s advice.
      </p>
      <div className="mt-10 space-y-6 text-orchard/85">
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Contract formation</h2>
          <p className="mt-2">
            An order is accepted after payment is confirmed and a confirmation email is sent.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Prices and VAT</h2>
          <p className="mt-2">Prices are shown in euros; state your VAT status according to your business.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Alcohol</h2>
          <p className="mt-2">
            We sell only to adults of legal drinking age. Proof of age may be required on delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
