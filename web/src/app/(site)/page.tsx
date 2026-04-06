import type { Metadata } from "next";
import { HomePageLayout } from "@/components/home/HomePageLayout";
import { boxes } from "@/data/boxes";
import { getHomePageGlobal, getSiteSettings } from "@/lib/cms-globals";
import { isShopEnabled } from "@/lib/feature-flags";
import { homeMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

const featured = boxes.filter((b) => b.inStock).slice(0, 2);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return homeMetadata(settings);
}

export default async function HomePage() {
  const shopEnabled = isShopEnabled();
  const home = await getHomePageGlobal();
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "http://localhost:3000";

  return (
    <HomePageLayout
      layout={home.layout}
      shopEnabled={shopEnabled}
      baseUrl={baseUrl}
      featuredBoxes={featured}
    />
  );
}
