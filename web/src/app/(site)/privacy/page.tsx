import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-globals";
import { pageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitlePrivacy,
    metaDescription: settings.metaDescriptionPrivacy,
    titleSegmentFallback: "Privacy policy",
    descriptionFallback: "Privacy policy — Sodo Sidrinė.",
  });
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark">Privacy policy</h1>
      <p className="mt-4 text-sm text-orchard/70">
        Template — have a lawyer review before publishing and align with your actual data practices
        and your Stripe agreement.
      </p>
      <div className="mt-10 space-y-6 text-orchard/85">
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Data controller</h2>
          <p className="mt-2">
            Sodo Sidrinė (add the exact legal name, company code, and contact details).
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Data we collect</h2>
          <p className="mt-2">
            When you order: name, shipping address, email; payment data is processed by the payment
            provider (Stripe).
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-orchard-dark">Your rights (GDPR)</h2>
          <p className="mt-2">
            You may request access, correction, erasure, or restriction. For complaints, contact your
            local data protection authority.
          </p>
        </section>
      </div>
    </div>
  );
}
