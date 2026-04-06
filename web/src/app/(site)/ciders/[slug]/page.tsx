import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCiderBySlug } from "@/lib/cider-data";
import { isShopEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cider = await getCiderBySlug(slug);
  if (!cider) return { title: "Cider not found" };
  return {
    title: cider.name,
    description: cider.shortDescription,
  };
}

export default async function CiderDetailPage({ params }: Props) {
  const { slug } = await params;
  const cider = await getCiderBySlug(slug);
  if (!cider) notFound();
  const shopEnabled = isShopEnabled();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/ciders" className="text-sm font-medium text-must hover:underline">
        ← Back to catalogue
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200 lg:aspect-auto lg:min-h-[480px]">
          <Image
            src={cider.imageSrc}
            alt=""
            fill
            className="object-cover"
            unoptimized={cider.imageSrc.startsWith("/images/")}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-must">
            {cider.styleLabel}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">
            {cider.name}
          </h1>
          <p className="mt-2 text-sm text-orchard/70">
            {cider.abv} ABV · {cider.volumeMl} ml
            {!cider.available ? (
              <span className="ml-2 rounded-md bg-cream-200 px-2 py-0.5 text-xs font-medium text-russet">
                Currently unavailable
              </span>
            ) : null}
          </p>
          <p className="mt-6 text-lg text-orchard/90">{cider.shortDescription}</p>
          <p className="mt-4 whitespace-pre-line text-orchard/85">{cider.longDescription}</p>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-orchard/60">
              Tasting notes
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {cider.tastingNotes.map((note) => (
                <li
                  key={note}
                  className="rounded-full bg-cream-200 px-3 py-1 text-sm text-orchard-dark"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            {shopEnabled ? (
              <Button href="/shop" variant="primary">
                Boxes in the shop
              </Button>
            ) : (
              <Button href="/contact" variant="primary">
                Contact
              </Button>
            )}
            <Button href="/ciders" variant="secondary">
              More ciders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
