import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CiderBox } from "@/data/boxes";
import {
  resolveHomePageLayoutForRender,
  type HomePageLayoutBlock,
} from "@/lib/home-page-blocks";
import { mediaRefToAbsoluteUrl } from "@/lib/cms-globals";
import { formatEur } from "@/lib/format";

function pick(s: string | null | undefined, fallback: string): string {
  const t = s?.trim();
  return t || fallback;
}

type Props = {
  layout: HomePageLayoutBlock[];
  shopEnabled: boolean;
  baseUrl: string;
  featuredBoxes: CiderBox[];
};

export function HomePageLayout({ layout, shopEnabled, baseUrl, featuredBoxes }: Props) {
  const resolvedLayout = resolveHomePageLayoutForRender(layout, shopEnabled);
  return (
    <>
      {resolvedLayout.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`;
        switch (block.blockType) {
          case "homeHero": {
            const heroAbsolute = mediaRefToAbsoluteUrl(block.heroImage, baseUrl);
            const heroSrc = heroAbsolute ?? "/images/cider-placeholder.svg";
            const eyebrow = pick(block.heroEyebrow, "Lithuanian cider");
            const heading = pick(block.heroHeading, "From the orchard — into your glass");
            const lead = pick(
              block.heroLead,
              "We ferment what our orchards grow: clear flavours, no compromises on ingredients.",
            );
            const extraShop = pick(
              block.heroExtraWhenShopEnabled,
              " Choose individual ciders or ready-made gift boxes.",
            );
            const extraNoShop = pick(
              block.heroExtraWhenShopDisabled,
              " Browse the catalogue and get in touch for orders or questions.",
            );
            return (
              <section
                key={key}
                className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200/80"
              >
                <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-must/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-orchard/10 blur-3xl" />
                <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:items-center sm:px-6 sm:py-24">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-must">{eyebrow}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-orchard-dark sm:text-5xl">
                      {heading}
                    </h1>
                    <p className="mt-5 max-w-lg text-lg text-orchard/85">
                      {lead}
                      {shopEnabled ? extraShop : extraNoShop}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      {shopEnabled ? (
                        <>
                          <Button href="/shop" variant="primary">
                            {pick(block.ctaPrimaryShopEnabled, "Shop")}
                          </Button>
                          <Button href="/ciders" variant="secondary">
                            {pick(block.ctaSecondaryShopEnabled, "View ciders")}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button href="/ciders" variant="primary">
                            {pick(block.ctaPrimaryShopDisabled, "View ciders")}
                          </Button>
                          <Button href="/contact" variant="secondary">
                            {pick(block.ctaSecondaryShopDisabled, "Contact")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative aspect-[4/5] max-h-[420px] w-full justify-self-center sm:max-h-none">
                    <div className="absolute inset-0 rounded-3xl bg-orchard/20 shadow-inner ring-1 ring-orchard/10" />
                    <Image
                      src={heroSrc}
                      alt=""
                      fill
                      className="rounded-3xl object-cover mix-blend-multiply"
                      priority
                      unoptimized={heroSrc.startsWith("/images/")}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </section>
            );
          }
          case "homeFeaturedBoxes":
            if (!shopEnabled) return null;
            {
              const featuredHeadingId = `featured-heading-${key}`;
              return (
              <section
                key={key}
                className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
                aria-labelledby={featuredHeadingId}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      id={featuredHeadingId}
                      className="font-display text-2xl font-semibold text-orchard-dark sm:text-3xl"
                    >
                      {pick(block.featuredSectionTitle, "Popular boxes")}
                    </h2>
                    <p className="mt-2 max-w-xl text-orchard/80">
                      {pick(
                        block.featuredSectionSubtitle,
                        "Packed for shipping — easy to buy for yourself or give as a gift.",
                      )}
                    </p>
                  </div>
                  <Link href="/shop" className="text-sm font-semibold text-must hover:text-russet">
                    {pick(block.featuredSectionLinkText, "All boxes →")}
                  </Link>
                </div>
                <ul className="mt-10 grid gap-8 sm:grid-cols-2">
                  {featuredBoxes.map((box) => (
                    <li
                      key={box.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:border-must/30 hover:shadow-md"
                    >
                      <Link href={`/shop/${box.slug}`} className="relative aspect-[16/10] block bg-cream-100">
                        <Image
                          src={box.imageSrc}
                          alt=""
                          fill
                          className="object-cover transition group-hover:scale-[1.02]"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-xl font-semibold text-orchard-dark">
                          <Link href={`/shop/${box.slug}`} className="hover:text-must">
                            {box.name}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 text-sm text-orchard/80">{box.description}</p>
                        <p className="mt-4 font-semibold text-orchard">{formatEur(box.priceEur)}</p>
                        <Button
                          href={`/shop/${box.slug}`}
                          variant="secondary"
                          className="mt-4 w-full sm:w-auto"
                        >
                          {pick(block.featuredBoxButtonLabel, "Details")}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              );
            }
          case "homePillars":
            return (
              <section key={key} className="border-y border-cream-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                  <ul className="grid gap-8 text-center sm:grid-cols-3 sm:gap-4">
                    <li>
                      <p className="font-display text-lg font-semibold text-orchard-dark">
                        {pick(block.pillar1Title, "Local varieties")}
                      </p>
                      <p className="mt-1 text-sm text-orchard/75">
                        {pick(block.pillar1Body, "Apples and pears from our orchards")}
                      </p>
                    </li>
                    <li>
                      <p className="font-display text-lg font-semibold text-orchard-dark">
                        {pick(block.pillar2Title, "Transparent process")}
                      </p>
                      <p className="mt-1 text-sm text-orchard/75">
                        {pick(block.pillar2Body, "Fermentation and ageing without shortcuts")}
                      </p>
                    </li>
                    <li>
                      <p className="font-display text-lg font-semibold text-orchard-dark">
                        {shopEnabled
                          ? pick(block.pillar3TitleWhenShopEnabled, "Gift-ready boxes")
                          : pick(block.pillar3TitleWhenShopDisabled, "Contact & news")}
                      </p>
                      <p className="mt-1 text-sm text-orchard/75">
                        {shopEnabled ? (
                          pick(block.pillar3BodyWhenShopEnabled, "Packed and ready to give")
                        ) : (
                          <Link href="/contact" className="text-must hover:underline">
                            {pick(block.pillar3LinkTextWhenShopDisabled, "Write to us")}
                          </Link>
                        )}
                      </p>
                    </li>
                  </ul>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
