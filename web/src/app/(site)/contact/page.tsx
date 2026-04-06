import type { Metadata } from "next";
import { LexicalRichText } from "@/components/cms/LexicalRichText";
import { getContactPageGlobal, getSiteSettings } from "@/lib/cms-globals";
import { hasLexicalContent } from "@/lib/rich-text";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleContact,
    metaDescription: settings.metaDescriptionContact,
    titleSegmentFallback: "Contact",
    descriptionFallback: "Get in touch with Sodo Sidrinė.",
  });
}

export default async function ContactPage() {
  const contact = await getContactPageGlobal();
  const heading = contact.heading?.trim() || "Contact us";
  const email = contact.email?.trim();
  const phone = contact.phone?.trim();
  const address = contact.address?.trim();
  const showIntro = hasLexicalContent(contact.intro);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-must">Contact</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">
        {heading}
      </h1>
      {showIntro ? (
        <LexicalRichText
          data={contact.intro}
          className="cms-richtext mt-8 space-y-4 text-base leading-relaxed text-orchard/90 [&_a]:text-must [&_a]:underline-offset-2 hover:[&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        />
      ) : (
        <p className="mt-8 text-base leading-relaxed text-orchard/80">
          Questions about our ciders or collaboration? Email or call — we will reply as soon as we can.
          You can edit these details in the admin: Site → Contact page.
        </p>
      )}
      <dl className="mt-10 space-y-6 border-t border-cream-200 pt-10">
        {email ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-orchard/50">Email</dt>
            <dd className="mt-1">
              <a href={`mailto:${email}`} className="text-must hover:underline">
                {email}
              </a>
            </dd>
          </div>
        ) : null}
        {phone ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-orchard/50">Phone</dt>
            <dd className="mt-1">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-must hover:underline">
                {phone}
              </a>
            </dd>
          </div>
        ) : null}
        {address ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-orchard/50">Address</dt>
            <dd className="mt-1 whitespace-pre-line text-orchard/90">{address}</dd>
          </div>
        ) : null}
        {!email && !phone && !address ? (
          <p className="text-sm text-orchard/60">
            Contact fields are empty for now — fill them in the admin.
          </p>
        ) : null}
      </dl>
    </div>
  );
}
