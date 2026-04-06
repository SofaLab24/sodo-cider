import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import type { Cider } from "@/data/ciders";
import { getCiderBySlug } from "@/lib/cider-data";
import { getShopBoxBySlug } from "@/lib/shop-data";
import { formatEur } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const box = await getShopBoxBySlug(slug);
  if (!box) return { title: "Product not found" };
  return {
    title: box.name,
    description: box.description,
  };
}

export default async function BoxDetailPage({ params }: Props) {
  const { slug } = await params;
  const box = await getShopBoxBySlug(slug);
  if (!box) notFound();

  const resolved = await Promise.all(box.containsSlugs.map((s) => getCiderBySlug(s)));
  const contents = resolved.filter((c): c is Cider => c != null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/shop" className="text-sm font-medium text-must hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream-200 lg:aspect-auto lg:min-h-[360px]">
          <Image
            src={box.imageSrc}
            alt=""
            fill
            className="object-cover"
            unoptimized={box.imageSrc.startsWith("/images/")}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">{box.name}</h1>
          <p className="mt-4 text-lg text-orchard/90">{box.description}</p>
          <p className="mt-6 font-display text-2xl font-semibold text-orchard">{formatEur(box.priceEur)}</p>
          <div className="mt-8">
            <AddToCartButton
              boxId={box.id}
              slug={box.slug}
              name={box.name}
              priceEur={box.priceEur}
              disabled={!box.inStock}
              disabledReason="Sold out for now. Check back later or message us on Instagram."
            />
          </div>
          <div className="mt-10 border-t border-cream-200 pt-8">
            <h2 className="font-display text-lg font-semibold text-orchard-dark">What&apos;s in the box</h2>
            <ul className="mt-4 space-y-3">
              {contents.map((cider) =>
                cider ? (
                  <li key={`${box.id}-${cider.slug}`}>
                    <Link
                      href={`/ciders/${cider.slug}`}
                      className="text-sm font-medium text-must hover:underline"
                    >
                      {cider.name}
                    </Link>
                    <span className="text-sm text-orchard/70"> — {cider.volumeMl} ml</span>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
