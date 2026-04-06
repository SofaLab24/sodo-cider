"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import type { NavLabels } from "@/lib/cms-globals";

function buildNav(shopEnabled: boolean, labels: NavLabels) {
  const items = [
    { href: "/ciders", label: labels.ciders },
    ...(shopEnabled ? [{ href: "/shop" as const, label: labels.shop }] : []),
    { href: "/about", label: labels.about },
    { href: "/contact", label: labels.contact },
  ];
  return items;
}

type Props = {
  shopEnabled: boolean;
  siteName: string;
  navLabels: NavLabels;
};

export function SiteHeader({ shopEnabled, siteName, navLabels }: Props) {
  const nav = buildNav(shopEnabled, navLabels);
  const { totalItems: cartCount } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-cream-200/80 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-orchard-dark sm:text-2xl"
        >
          {siteName}
        </Link>
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-orchard/90 transition hover:text-must"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {shopEnabled ? (
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative rounded-full border border-orchard/15 bg-white px-4 py-2 text-sm font-medium text-orchard shadow-sm transition hover:border-must/40 hover:text-orchard-dark"
            >
              {navLabels.cart}
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-must px-1 text-xs font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        ) : null}
      </div>
      <nav
        className="flex justify-center gap-5 border-t border-cream-200/60 bg-cream-100/80 px-4 py-2 sm:hidden"
        aria-label="Mobile navigation"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs font-medium text-orchard/90"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
