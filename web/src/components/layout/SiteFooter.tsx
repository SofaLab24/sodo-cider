import Link from "next/link";

const legal = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of purchase" },
  { href: "/shipping", label: "Shipping & returns" },
];

type SiteFooterProps = {
  siteName: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

export function SiteFooter({ siteName, instagramUrl, facebookUrl }: SiteFooterProps) {
  const social = [
    instagramUrl?.trim() ? { href: instagramUrl.trim(), label: "Instagram" } : null,
    facebookUrl?.trim() ? { href: facebookUrl.trim(), label: "Facebook" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="mt-auto border-t border-cream-200 bg-orchard-dark text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-cream-50">{siteName}</p>
            <p className="mt-2 max-w-sm text-sm text-cream-200/90">
              Cider from our orchard — Lithuanian-grown fruit, clear flavour, and an open story.
            </p>
            {social.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-4">
                {social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-must-light underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-must-light">Legal</p>
            <ul className="mt-3 space-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-100/85 underline-offset-4 hover:text-must-light hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-cream-200/70">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
