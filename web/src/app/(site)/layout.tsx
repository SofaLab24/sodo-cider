import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Providers } from "@/components/providers";
import { getNavLabels, getSiteName, getSiteSettings } from "@/lib/cms-globals";
import { isShopEnabled } from "@/lib/feature-flags";
import "../globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = getSiteName(settings);
  return {
    title: {
      template: `%s | ${name}`,
      default: name,
    },
    description:
      "Lithuanian orchard cider: dry and sweeter styles, gift boxes. Sodo Sidrinė.",
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const shopEnabled = isShopEnabled();
  const navLabels = getNavLabels(settings);
  const siteName = getSiteName(settings);
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader shopEnabled={shopEnabled} siteName={siteName} navLabels={navLabels} />
            <main className="flex-1">{children}</main>
            <SiteFooter
              siteName={siteName}
              instagramUrl={settings.instagramUrl ?? undefined}
              facebookUrl={settings.facebookUrl ?? undefined}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
