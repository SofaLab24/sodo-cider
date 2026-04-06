import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CiderStyleFilters } from "@/components/ciders/CiderStyleFilters";
import { getSiteSettings } from "@/lib/cms-globals";
import { listCiderStyles, listCiders } from "@/lib/cider-data";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    metaTitle: settings.metaTitleCiders,
    metaDescription: settings.metaDescriptionCiders,
    titleSegmentFallback: "Ciders",
    descriptionFallback: "Sodo Sidrinė cider catalogue — dry, sweeter, and sparkling styles.",
  });
}

export default async function CidersPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string }>;
}) {
  const { style: styleParam } = await searchParams;
  const styleOptions = await listCiderStyles();
  const allowedSlugs = new Set(styleOptions.map((s) => s.slug));
  const filter =
    styleParam && allowedSlugs.has(styleParam) ? styleParam : null;
  const all = await listCiders();
  const list = filter ? all.filter((c) => c.style === filter) : all;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-orchard-dark sm:text-4xl">Ciders</h1>
      <p className="mt-3 max-w-2xl text-orchard/85">
        The catalogue syncs with Payload. Filter by style.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-cream-200" />}>
          <CiderStyleFilters styles={styleOptions} />
        </Suspense>
      </div>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((cider) => (
          <li
            key={cider.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:border-must/25 hover:shadow"
          >
            <Link href={`/ciders/${cider.slug}`} className="relative aspect-[3/4] bg-cream-100">
              <Image
                src={cider.imageSrc}
                alt=""
                fill
                className="object-cover"
                unoptimized={cider.imageSrc.startsWith("/images/")}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {!cider.available ? (
                <span className="absolute right-3 top-3 rounded-full bg-russet/90 px-2.5 py-1 text-xs font-semibold text-white">
                  Out of stock
                </span>
              ) : null}
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-must">
                {cider.styleLabel}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-orchard-dark">
                <Link href={`/ciders/${cider.slug}`} className="hover:text-must">
                  {cider.name}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-orchard/80">{cider.shortDescription}</p>
              <p className="mt-3 text-xs text-orchard/60">
                {cider.abv} · {cider.volumeMl} ml
              </p>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 ? (
        <p className="mt-12 text-center text-orchard/70">
          {filter
            ? "No ciders match this filter."
            : "No ciders are published yet. Add entries in the admin under Catalog → Ciders."}
        </p>
      ) : null}
    </div>
  );
}
