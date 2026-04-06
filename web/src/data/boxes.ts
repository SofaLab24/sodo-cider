export type CiderBox = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceEur: number;
  /** Cider slugs included in the box */
  containsSlugs: string[];
  imageSrc: string;
  inStock: boolean;
};

/** Demo shop SKUs — swap for Payload / Stripe later */
export const boxes: CiderBox[] = [
  {
    id: "b1",
    slug: "tasting-set",
    name: "Tasting set",
    description: "Three different 330 ml bottles — a great introduction to our orchard flavours.",
    priceEur: 18.9,
    containsSlugs: ["apple-dry", "pear-semi-dry", "cranberry-blend"],
    imageSrc: "/images/box-placeholder.svg",
    inStock: true,
  },
  {
    id: "b2",
    slug: "dry-collection",
    name: "Dry collection",
    description: "Six dry and semi-dry cider bottles for gifting or a long evening.",
    priceEur: 42.0,
    containsSlugs: ["apple-dry", "apple-dry", "pear-semi-dry"],
    imageSrc: "/images/box-placeholder.svg",
    inStock: true,
  },
  {
    id: "b3",
    slug: "table-set",
    name: "Table set",
    description: "One 750 ml sparkling and four 330 ml bottles — for gatherings with friends.",
    priceEur: 55.0,
    containsSlugs: ["sparkling-apple", "apple-dry", "pear-semi-dry"],
    imageSrc: "/images/box-placeholder.svg",
    inStock: false,
  },
];

export function getBoxBySlug(slug: string): CiderBox | undefined {
  return boxes.find((b) => b.slug === slug);
}
