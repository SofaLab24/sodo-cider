/** Style options when running without a database (demo / local). Mirrors typical Payload cider-styles. */
export const STATIC_CIDER_STYLE_OPTIONS: { slug: string; label: string }[] = [
  { slug: "dry", label: "Dry" },
  { slug: "semi_dry", label: "Semi-dry" },
  { slug: "sweet", label: "Sweet" },
  { slug: "sparkling", label: "Sparkling" },
];

export type CiderStyleOption = (typeof STATIC_CIDER_STYLE_OPTIONS)[number];

export type Cider = {
  id: string;
  slug: string;
  name: string;
  /** Style slug (URL filter); matches Cider styles collection `slug`. */
  style: string;
  /** Human-readable style name for the storefront. */
  styleLabel: string;
  abv: string;
  volumeMl: number;
  shortDescription: string;
  longDescription: string;
  tastingNotes: string[];
  imageSrc: string;
  available: boolean;
};

const styleLabelBySlug = Object.fromEntries(
  STATIC_CIDER_STYLE_OPTIONS.map((s) => [s.slug, s.label]),
) as Record<string, string>;

/** Demo catalogue when DATABASE_URL is not set */
export const ciders: Cider[] = [
  {
    id: "1",
    slug: "apple-dry",
    name: "Dry apple",
    style: "dry",
    styleLabel: styleLabelBySlug.dry ?? "Dry",
    abv: "5.5 %",
    volumeMl: 330,
    shortDescription: "Crisp, mineral apple cider from Lithuanian orchard varieties.",
    longDescription:
      "Cold-fermented with no added sugar after fermentation. Pairs with light snacks and cheese.",
    tastingNotes: ["apple", "citrus", "soft tannin"],
    imageSrc: "/images/cider-placeholder.svg",
    available: true,
  },
  {
    id: "2",
    slug: "pear-semi-dry",
    name: "Semi-dry pear",
    style: "semi_dry",
    styleLabel: styleLabelBySlug.semi_dry ?? "Semi-dry",
    abv: "4.8 %",
    volumeMl: 330,
    shortDescription: "Pear sweetness balanced with acidity.",
    longDescription:
      "A blend of traditional orchard pears. Works well with poultry and fresh salads.",
    tastingNotes: ["pear", "honey", "gentle sparkle"],
    imageSrc: "/images/cider-placeholder.svg",
    available: true,
  },
  {
    id: "3",
    slug: "cranberry-blend",
    name: "Cranberry blend",
    style: "sweet",
    styleLabel: styleLabelBySlug.sweet ?? "Sweet",
    abv: "4.0 %",
    volumeMl: 330,
    shortDescription: "Tart cranberry notes on an apple base.",
    longDescription:
      "Lightly sweet and refreshing — nice as an aperitif or with dessert.",
    tastingNotes: ["cranberry", "red apple", "fresh"],
    imageSrc: "/images/cider-placeholder.svg",
    available: true,
  },
  {
    id: "4",
    slug: "sparkling-apple",
    name: "Sparkling apple",
    style: "sparkling",
    styleLabel: styleLabelBySlug.sparkling ?? "Sparkling",
    abv: "6.0 %",
    volumeMl: 750,
    shortDescription: "Bottle-fermented sparkling cider for the table and celebrations.",
    longDescription:
      "Secondary fermentation in bottle. More complex aroma and a longer finish.",
    tastingNotes: ["toast", "dried apple", "fine bubbles"],
    imageSrc: "/images/cider-placeholder.svg",
    available: false,
  },
];
