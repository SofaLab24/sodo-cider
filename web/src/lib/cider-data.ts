import { getPayload } from "payload";
import config from "@payload-config";
import {
  ciders as staticCiders,
  STATIC_CIDER_STYLE_OPTIONS,
  type Cider,
  type CiderStyleOption,
} from "@/data/ciders";

type MediaRef = { url?: string | null } | string | null | undefined;

type CiderDoc = {
  id: string | number;
  title: string;
  slug: string;
  style?: unknown;
  shortDescription?: string | null;
  longDescription?: unknown;
  abv?: number | null;
  volumeMl?: number | null;
  tastingNotes?: string | null;
  featuredImage?: MediaRef;
  available?: boolean | null;
};

function absolutizeMediaUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function mediaToSrc(media: MediaRef, baseUrl: string): string {
  if (!media || typeof media === "string") return "/images/cider-placeholder.svg";
  if (media.url) return absolutizeMediaUrl(media.url, baseUrl);
  return "/images/cider-placeholder.svg";
}

function formatAbvPct(n: number): string {
  return `${n.toFixed(1)} %`;
}

function lexicalToPlainText(node: unknown): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node !== "object") return "";
  const obj = node as Record<string, unknown>;
  if (obj.type === "text" && typeof obj.text === "string") return obj.text;
  if (Array.isArray(obj.children)) {
    return obj.children.map(lexicalToPlainText).join("");
  }
  if (obj.root && typeof obj.root === "object") {
    return lexicalToPlainText(obj.root);
  }
  return "";
}

function parseTastingNotes(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  const lines = raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.length ? lines : [];
}

function resolveStyleFromRelation(style: unknown): { slug: string; label: string } {
  if (style && typeof style === "object" && !Array.isArray(style)) {
    const o = style as Record<string, unknown>;
    const slug = typeof o.slug === "string" ? o.slug.trim() : "";
    const label = typeof o.label === "string" ? o.label.trim() : "";
    if (slug) return { slug, label: label || slug };
  }
  return { slug: "unknown", label: "Unknown" };
}

function mapPayloadCider(doc: CiderDoc, baseUrl: string): Cider {
  const abvNum = typeof doc.abv === "number" ? doc.abv : 0;
  const { slug: styleSlug, label: styleLabel } = resolveStyleFromRelation(doc.style);
  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.title,
    style: styleSlug,
    styleLabel,
    abv: formatAbvPct(abvNum),
    volumeMl: typeof doc.volumeMl === "number" ? doc.volumeMl : 0,
    shortDescription: doc.shortDescription?.trim() ?? "",
    longDescription: lexicalToPlainText(doc.longDescription).trim() || doc.shortDescription?.trim() || "",
    tastingNotes: parseTastingNotes(doc.tastingNotes),
    imageSrc: mediaToSrc(doc.featuredImage, baseUrl),
    available: doc.available !== false,
  };
}

function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/** Style chips on /ciders — from Payload when DB is configured. */
export async function listCiderStyles(): Promise<CiderStyleOption[]> {
  if (!hasDatabase()) {
    return STATIC_CIDER_STYLE_OPTIONS;
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "cider-styles",
      limit: 200,
      sort: "sortOrder",
      depth: 0,
    });
    const rows: CiderStyleOption[] = [];
    for (const d of res.docs) {
      const doc = d as { slug?: string | null; label?: string | null };
      const slug = doc.slug?.trim();
      const label = doc.label?.trim();
      if (slug) rows.push({ slug, label: label || slug });
    }
    return rows;
  } catch {
    return STATIC_CIDER_STYLE_OPTIONS;
  }
}

/** Catalogue: Payload only when DB is set — no merge with static demo ciders. */
export async function listCiders(): Promise<Cider[]> {
  if (!hasDatabase()) {
    return staticCiders;
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "ciders",
      depth: 2,
      limit: 200,
      sort: "title",
    });
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
    return res.docs.map((d) => mapPayloadCider(d as CiderDoc, baseUrl));
  } catch {
    return [];
  }
}

export async function getCiderBySlug(slug: string): Promise<Cider | undefined> {
  if (!hasDatabase()) {
    return staticCiders.find((c) => c.slug === slug);
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "ciders",
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });
    const doc = res.docs[0] as CiderDoc | undefined;
    if (doc) {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
      return mapPayloadCider(doc, baseUrl);
    }
  } catch {
    /* empty */
  }
  return undefined;
}
