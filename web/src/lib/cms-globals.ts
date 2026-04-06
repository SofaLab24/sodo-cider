import { getPayload } from "payload";
import config from "@payload-config";

import {
  normalizeHomePageDoc,
  type HomePageData,
  type MediaRef,
} from "@/lib/home-page-blocks";

export type { HomePageData };

export type SiteSettingsData = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  siteName?: string | null;
  navCidersLabel?: string | null;
  navShopLabel?: string | null;
  navAboutLabel?: string | null;
  navContactLabel?: string | null;
  navCartLabel?: string | null;
  metaTitleHome?: string | null;
  metaDescriptionHome?: string | null;
  metaTitleCiders?: string | null;
  metaDescriptionCiders?: string | null;
  metaTitleAbout?: string | null;
  metaDescriptionAbout?: string | null;
  metaTitleContact?: string | null;
  metaDescriptionContact?: string | null;
  metaTitleShop?: string | null;
  metaDescriptionShop?: string | null;
  metaTitleCart?: string | null;
  metaDescriptionCart?: string | null;
  metaTitlePrivacy?: string | null;
  metaDescriptionPrivacy?: string | null;
  metaTitleTerms?: string | null;
  metaDescriptionTerms?: string | null;
  metaTitleShipping?: string | null;
  metaDescriptionShipping?: string | null;
};

export type AboutPageData = {
  heading?: string | null;
  heroImage?: { url?: string | null } | number | null;
  body?: unknown;
};

export type ContactPageData = {
  heading?: string | null;
  intro?: unknown;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type NavLabels = {
  ciders: string;
  shop: string;
  about: string;
  contact: string;
  cart: string;
};

function str(v: string | null | undefined, fallback: string): string {
  const t = v?.trim();
  return t || fallback;
}

export function getNavLabels(settings: SiteSettingsData): NavLabels {
  return {
    ciders: str(settings.navCidersLabel, "Ciders"),
    shop: str(settings.navShopLabel, "Shop"),
    about: str(settings.navAboutLabel, "About"),
    contact: str(settings.navContactLabel, "Contact"),
    cart: str(settings.navCartLabel, "Cart"),
  };
}

export function getSiteName(settings: SiteSettingsData): string {
  return str(settings.siteName, "Sodo Sidrinė");
}

function absolutizeMediaUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

export function mediaRefToAbsoluteUrl(
  media: AboutPageData["heroImage"] | MediaRef,
  baseUrl: string,
): string | null {
  if (!media || typeof media === "number") return null;
  if (typeof media === "object" && media.url) {
    return absolutizeMediaUrl(media.url, baseUrl);
  }
  return null;
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  return doc as SiteSettingsData;
}

export async function getHomePageGlobal(): Promise<HomePageData> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({ slug: "home-page", depth: 1 });
  return normalizeHomePageDoc(doc as unknown as Record<string, unknown>);
}

export async function getAboutPageGlobal(): Promise<AboutPageData> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({ slug: "about-page", depth: 1 });
  return doc as AboutPageData;
}

export async function getContactPageGlobal(): Promise<ContactPageData> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({ slug: "contact-page", depth: 0 });
  return doc as ContactPageData;
}
