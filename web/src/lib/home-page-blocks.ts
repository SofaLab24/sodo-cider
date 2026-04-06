/** Types and normalization for the home global `layout` blocks field. */

export type MediaRef = { url?: string | null } | number | null | undefined;

export type HomeHeroBlockData = {
  id?: string | null;
  blockType: "homeHero";
  heroImage?: MediaRef;
  heroEyebrow?: string | null;
  heroHeading?: string | null;
  heroLead?: string | null;
  heroExtraWhenShopEnabled?: string | null;
  heroExtraWhenShopDisabled?: string | null;
  ctaPrimaryShopEnabled?: string | null;
  ctaSecondaryShopEnabled?: string | null;
  ctaPrimaryShopDisabled?: string | null;
  ctaSecondaryShopDisabled?: string | null;
};

export type HomeFeaturedBoxesBlockData = {
  id?: string | null;
  blockType: "homeFeaturedBoxes";
  featuredSectionTitle?: string | null;
  featuredSectionSubtitle?: string | null;
  featuredSectionLinkText?: string | null;
  featuredBoxButtonLabel?: string | null;
};

export type HomePillarsBlockData = {
  id?: string | null;
  blockType: "homePillars";
  pillar1Title?: string | null;
  pillar1Body?: string | null;
  pillar2Title?: string | null;
  pillar2Body?: string | null;
  pillar3TitleWhenShopEnabled?: string | null;
  pillar3BodyWhenShopEnabled?: string | null;
  pillar3TitleWhenShopDisabled?: string | null;
  pillar3LinkTextWhenShopDisabled?: string | null;
};

export type HomePageLayoutBlock =
  | HomeHeroBlockData
  | HomeFeaturedBoxesBlockData
  | HomePillarsBlockData;

export type HomePageData = {
  layout: HomePageLayoutBlock[];
};

function isBlockRow(x: unknown): x is HomePageLayoutBlock {
  return (
    typeof x === "object" &&
    x !== null &&
    "blockType" in x &&
    typeof (x as { blockType: unknown }).blockType === "string"
  );
}

function parseLayoutRows(x: unknown): HomePageLayoutBlock[] | null {
  if (!Array.isArray(x) || x.length === 0) return null;
  const rows = x.filter(isBlockRow) as HomePageLayoutBlock[];
  return rows.length > 0 ? rows : null;
}

const KNOWN_BLOCK_SLUGS = new Set<string>(["homeHero", "homeFeaturedBoxes", "homePillars"]);

function blockWouldRenderOnSite(b: HomePageLayoutBlock, shopEnabled: boolean): boolean {
  if (!KNOWN_BLOCK_SLUGS.has(b.blockType)) return false;
  if (b.blockType === "homeFeaturedBoxes") return shopEnabled;
  return true;
}

/**
 * If the saved layout would render nothing (e.g. only "Featured boxes" while the shop is off),
 * fall back to built-in defaults so the homepage is never empty.
 */
export function resolveHomePageLayoutForRender(
  layout: HomePageLayoutBlock[],
  shopEnabled: boolean,
): HomePageLayoutBlock[] {
  const knownOnly = layout.filter((b) => KNOWN_BLOCK_SLUGS.has(b.blockType));
  const anyVisible = knownOnly.some((b) => blockWouldRenderOnSite(b, shopEnabled));
  if (!anyVisible) {
    return defaultLayout().filter((b) => blockWouldRenderOnSite(b, shopEnabled));
  }
  return knownOnly;
}

function defaultLayout(): HomePageLayoutBlock[] {
  return [
    {
      id: "default-homeHero",
      blockType: "homeHero",
      heroEyebrow: "Lithuanian cider",
      heroHeading: "From the orchard — into your glass",
      heroLead:
        "We ferment what our orchards grow: clear flavours, no compromises on ingredients.",
      heroExtraWhenShopEnabled: " Choose individual ciders or ready-made gift boxes.",
      heroExtraWhenShopDisabled:
        " Browse the catalogue and get in touch for orders or questions.",
      ctaPrimaryShopEnabled: "Shop",
      ctaSecondaryShopEnabled: "View ciders",
      ctaPrimaryShopDisabled: "View ciders",
      ctaSecondaryShopDisabled: "Contact",
    },
    {
      id: "default-homeFeaturedBoxes",
      blockType: "homeFeaturedBoxes",
      featuredSectionTitle: "Popular boxes",
      featuredSectionSubtitle:
        "Packed for shipping — easy to buy for yourself or give as a gift.",
      featuredSectionLinkText: "All boxes →",
      featuredBoxButtonLabel: "Details",
    },
    {
      id: "default-homePillars",
      blockType: "homePillars",
      pillar1Title: "Local varieties",
      pillar1Body: "Apples and pears from our orchards",
      pillar2Title: "Transparent process",
      pillar2Body: "Fermentation and ageing without shortcuts",
      pillar3TitleWhenShopEnabled: "Gift-ready boxes",
      pillar3BodyWhenShopEnabled: "Packed and ready to give",
      pillar3TitleWhenShopDisabled: "Contact & news",
      pillar3LinkTextWhenShopDisabled: "Write to us",
    },
  ];
}

type LegacyFlat = Record<string, unknown>;

function hasLegacyShape(doc: LegacyFlat): boolean {
  return (
    doc.heroHeading != null ||
    doc.heroEyebrow != null ||
    doc.heroImage != null ||
    doc.featuredSectionTitle != null ||
    doc.pillar1Title != null
  );
}

function legacyToLayout(doc: LegacyFlat): HomePageLayoutBlock[] {
  return [
    {
      id: "migrated-homeHero",
      blockType: "homeHero",
      heroImage: doc.heroImage as HomeHeroBlockData["heroImage"],
      heroEyebrow: doc.heroEyebrow as string | null | undefined,
      heroHeading: doc.heroHeading as string | null | undefined,
      heroLead: doc.heroLead as string | null | undefined,
      heroExtraWhenShopEnabled: doc.heroExtraWhenShopEnabled as string | null | undefined,
      heroExtraWhenShopDisabled: doc.heroExtraWhenShopDisabled as string | null | undefined,
      ctaPrimaryShopEnabled: doc.ctaPrimaryShopEnabled as string | null | undefined,
      ctaSecondaryShopEnabled: doc.ctaSecondaryShopEnabled as string | null | undefined,
      ctaPrimaryShopDisabled: doc.ctaPrimaryShopDisabled as string | null | undefined,
      ctaSecondaryShopDisabled: doc.ctaSecondaryShopDisabled as string | null | undefined,
    },
    {
      id: "migrated-homeFeaturedBoxes",
      blockType: "homeFeaturedBoxes",
      featuredSectionTitle: doc.featuredSectionTitle as string | null | undefined,
      featuredSectionSubtitle: doc.featuredSectionSubtitle as string | null | undefined,
      featuredSectionLinkText: doc.featuredSectionLinkText as string | null | undefined,
      featuredBoxButtonLabel: doc.featuredBoxButtonLabel as string | null | undefined,
    },
    {
      id: "migrated-homePillars",
      blockType: "homePillars",
      pillar1Title: doc.pillar1Title as string | null | undefined,
      pillar1Body: doc.pillar1Body as string | null | undefined,
      pillar2Title: doc.pillar2Title as string | null | undefined,
      pillar2Body: doc.pillar2Body as string | null | undefined,
      pillar3TitleWhenShopEnabled: doc.pillar3TitleWhenShopEnabled as string | null | undefined,
      pillar3BodyWhenShopEnabled: doc.pillar3BodyWhenShopEnabled as string | null | undefined,
      pillar3TitleWhenShopDisabled: doc.pillar3TitleWhenShopDisabled as string | null | undefined,
      pillar3LinkTextWhenShopDisabled: doc.pillar3LinkTextWhenShopDisabled as string | null | undefined,
    },
  ];
}

/** Ensures a non-empty layout: uses stored blocks, legacy flat global, or defaults. */
export function normalizeHomePageDoc(raw: Record<string, unknown>): HomePageData {
  const parsed = parseLayoutRows(raw.layout);
  if (parsed) {
    return { layout: parsed };
  }
  if (hasLegacyShape(raw)) {
    return { layout: legacyToLayout(raw) };
  }
  return { layout: defaultLayout() };
}
