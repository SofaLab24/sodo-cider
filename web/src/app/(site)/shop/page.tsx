import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/cms-globals";
import { listShopBoxes } from "@/lib/shop-data";
import { formatEur } from "@/lib/format";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleShop,
    metaDescription: settings.metaDescriptionShop,
    titleSegmentFallback: "Shop",
    descriptionFallback: "Sodo Sidrinė cider boxes — order online.",
  });
}

export default async function ShopPage() {
  const shopBoxes = await listShopBoxes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">Shop</h1>
      <p className="mt-3 max-w-2xl text-orchard/85">
        Boxes are packed for shipping. Prices and copy are managed in Payload; checkout runs through
        Stripe Checkout.
      </p>
      <ul className="mt-12 grid gap-10 lg:grid-cols-3">
        {shopBoxes.map((box) => (
          <li
            key={box.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm"
          >
            <Link href={`/shop/${box.slug}`} className="relative aspect-[16/10] bg-cream-100">
              <Image
                src={box.imageSrc}
                alt=""
                fill
                className="object-cover"
                unoptimized={box.imageSrc.startsWith("/images/")}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {!box.inStock ? (
                <span className="absolute left-3 top-3 rounded-full bg-russet/90 px-2.5 py-1 text-xs font-semibold text-white">
                  Sold out
                </span>
              ) : null}
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-xl font-semibold text-orchard-dark">
                <Link href={`/shop/${box.slug}`} className="hover:text-must">
                  {box.name}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-orchard/80">{box.description}</p>
              <p className="mt-4 text-lg font-semibold text-orchard">{formatEur(box.priceEur)}</p>
              <Button
                href={`/shop/${box.slug}`}
                variant={box.inStock ? "primary" : "secondary"}
                className="mt-4 w-full"
              >
                {box.inStock ? "Choose" : "View"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
