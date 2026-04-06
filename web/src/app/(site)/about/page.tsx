import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LexicalRichText } from "@/components/cms/LexicalRichText";
import { Button } from "@/components/ui/Button";
import { getAboutPageGlobal, getSiteSettings, mediaRefToAbsoluteUrl } from "@/lib/cms-globals";
import { isShopEnabled } from "@/lib/feature-flags";
import { hasLexicalContent } from "@/lib/rich-text";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleAbout,
    metaDescription: settings.metaDescriptionAbout,
    titleSegmentFallback: "About",
    descriptionFallback: "Sodo Sidrinė — orchard cider made in Lithuania.",
  });
}

function DefaultAboutBody() {
  return (
    <div className="space-y-5 text-base leading-relaxed text-orchard/90">
      <p>
        Sodo Sidrinė started from a simple idea: use what we grow ourselves — apples and pears from
        Lithuanian orchards, without unnecessary additives or hidden ingredients. Each batch is small,
        carefully managed, and focused on flavour rather than mass production.
      </p>
      <p>
        We believe cider can be both an everyday table drink and something special for celebrations.
        That is why we offer different styles — from drier, more mineral profiles to gently sweeter
        blends and sparkling bottles for big occasions.
      </p>
      <p className="text-sm text-orchard/70">
        You can replace this text in the admin: Site → About page.
      </p>
    </div>
  );
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPageGlobal(), getSiteSettings()]);
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const heroAbsolute = mediaRefToAbsoluteUrl(about.heroImage, baseUrl);
  const heroSrc = heroAbsolute ?? "/images/cider-placeholder.svg";
  const heading = about.heading?.trim() || "The orchard that becomes cider";
  const shopEnabled = isShopEnabled();
  const ig = settings.instagramUrl?.trim();
  const showCmsBody = hasLexicalContent(about.body);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-must">About</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">
        {heading}
      </h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-cream-200">
        <Image
          src={heroSrc}
          alt=""
          fill
          className="object-cover"
          unoptimized={heroSrc.startsWith("/images/")}
          sizes="(max-width: 768px) 100vw, 42rem"
        />
      </div>
      {showCmsBody ? (
        <LexicalRichText
          data={about.body}
          className="cms-richtext mt-10 space-y-4 text-base leading-relaxed text-orchard/90 [&_a]:text-must [&_a]:underline-offset-2 hover:[&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-orchard-dark"
        />
      ) : (
        <div className="mt-10">
          <DefaultAboutBody />
        </div>
      )}
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/ciders" variant="primary">
          Our ciders
        </Button>
        {shopEnabled ? (
          <Button href="/shop" variant="secondary">
            Shop
          </Button>
        ) : (
          <Button href="/contact" variant="secondary">
            Contact
          </Button>
        )}
        {ig ? (
          <Button href={ig} variant="secondary">
            Instagram
          </Button>
        ) : null}
      </div>
      {ig ? (
        <p className="mt-6 text-sm text-orchard/60">
          Instagram:{" "}
          <Link href={ig} className="text-must hover:underline">
            {ig.replace(/^https?:\/\/(www\.)?/, "")}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
