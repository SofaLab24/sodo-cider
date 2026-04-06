"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CiderStyleOption } from "@/data/ciders";

export function CiderStyleFilters({ styles }: { styles: CiderStyleOption[] }) {
  const searchParams = useSearchParams();
  const allowed = new Set(styles.map((s) => s.slug));
  const raw = searchParams.get("style");
  const activeSlug = raw && allowed.has(raw) ? raw : null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by style">
      <Link
        href="/ciders"
        scroll={false}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeSlug === null
            ? "bg-orchard text-cream-50 shadow-sm"
            : "border border-cream-200 bg-white text-orchard hover:border-must/40"
        }`}
      >
        All
      </Link>
      {styles.map((s) => {
        const href = `/ciders?style=${encodeURIComponent(s.slug)}`;
        const isActive = activeSlug === s.slug;
        return (
          <Link
            key={s.slug}
            href={href}
            scroll={false}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-orchard text-cream-50 shadow-sm"
                : "border border-cream-200 bg-white text-orchard hover:border-must/40"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
