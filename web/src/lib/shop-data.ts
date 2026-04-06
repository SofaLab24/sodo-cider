import { getPayload } from "payload";
import config from "@payload-config";
import { boxes as staticBoxes, type CiderBox } from "@/data/boxes";

export type ShopBox = CiderBox & {
  /** Stripe Price ID when checkout is enabled for this SKU */
  stripePriceId?: string | null;
};

type MediaRef = { url?: string | null } | string | null | undefined;
type CiderRef = { slug?: string | null } | string | null | undefined;
type BoxDoc = {
  id: string | number;
  title: string;
  slug: string;
  description?: string | null;
  priceEur: number;
  inStock?: boolean | null;
  stripePriceId?: string | null;
  image?: MediaRef;
  containsCiders?: CiderRef[] | null;
};

function absolutizeMediaUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function mediaToSrc(media: MediaRef, baseUrl: string): string {
  if (!media || typeof media === "string") return "/images/box-placeholder.svg";
  if (media.url) return absolutizeMediaUrl(media.url, baseUrl);
  return "/images/box-placeholder.svg";
}

function ciderRefsToSlugs(refs: CiderRef[] | null | undefined): string[] {
  if (!refs?.length) return [];
  return refs
    .map((c) => {
      if (c && typeof c === "object" && typeof c.slug === "string") return c.slug;
      return null;
    })
    .filter((s): s is string => Boolean(s));
}

function mapPayloadBox(doc: BoxDoc, baseUrl: string): ShopBox {
  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.title,
    description: doc.description ?? "",
    priceEur: doc.priceEur,
    containsSlugs: ciderRefsToSlugs(doc.containsCiders ?? undefined),
    imageSrc: mediaToSrc(doc.image, baseUrl),
    inStock: Boolean(doc.inStock),
    stripePriceId: doc.stripePriceId ?? null,
  };
}

function mapStaticToShop(box: CiderBox): ShopBox {
  return { ...box, stripePriceId: null };
}

export async function listShopBoxes(): Promise<ShopBox[]> {
  if (!process.env.DATABASE_URL?.trim()) {
    return staticBoxes.map(mapStaticToShop);
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "boxes",
      depth: 2,
      limit: 100,
      sort: "title",
    });
    if (res.docs.length === 0) {
      return staticBoxes.map(mapStaticToShop);
    }
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
    return res.docs.map((d) => mapPayloadBox(d as BoxDoc, baseUrl));
  } catch {
    return staticBoxes.map(mapStaticToShop);
  }
}

export async function getShopBoxBySlug(slug: string): Promise<ShopBox | undefined> {
  const fromStatic = staticBoxes.find((b) => b.slug === slug);
  if (!process.env.DATABASE_URL?.trim()) {
    return fromStatic ? mapStaticToShop(fromStatic) : undefined;
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "boxes",
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });
    const doc = res.docs[0] as BoxDoc | undefined;
    if (doc) {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
      return mapPayloadBox(doc, baseUrl);
    }
  } catch {
    /* fall through */
  }
  return fromStatic ? mapStaticToShop(fromStatic) : undefined;
}
