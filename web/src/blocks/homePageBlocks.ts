import type { Block } from "payload";

export const homeHeroBlock: Block = {
  slug: "homeHero",
  labels: {
    singular: "Hero",
    plural: "Hero sections",
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Image",
    },
    {
      name: "heroEyebrow",
      type: "text",
      label: "Eyebrow (small line above headline)",
      defaultValue: "Lithuanian cider",
    },
    {
      name: "heroHeading",
      type: "text",
      label: "Main headline",
      defaultValue: "From the orchard — into your glass",
    },
    {
      name: "heroLead",
      type: "textarea",
      label: "Opening paragraph",
      defaultValue:
        "We ferment what our orchards grow: clear flavours, no compromises on ingredients.",
    },
    {
      name: "heroExtraWhenShopEnabled",
      type: "textarea",
      label: "Extra sentence (when shop is ON)",
      defaultValue: " Choose individual ciders or ready-made gift boxes.",
    },
    {
      name: "heroExtraWhenShopDisabled",
      type: "textarea",
      label: "Extra sentence (when shop is OFF)",
      defaultValue: " Browse the catalogue and get in touch for orders or questions.",
    },
    {
      name: "ctaPrimaryShopEnabled",
      type: "text",
      label: "Primary button label (shop ON)",
      defaultValue: "Shop",
    },
    {
      name: "ctaSecondaryShopEnabled",
      type: "text",
      label: "Secondary button label (shop ON)",
      defaultValue: "View ciders",
    },
    {
      name: "ctaPrimaryShopDisabled",
      type: "text",
      label: "Primary button label (shop OFF)",
      defaultValue: "View ciders",
    },
    {
      name: "ctaSecondaryShopDisabled",
      type: "text",
      label: "Secondary button label (shop OFF)",
      defaultValue: "Contact",
    },
  ],
};

export const homeFeaturedBoxesBlock: Block = {
  slug: "homeFeaturedBoxes",
  labels: {
    singular: "Featured boxes",
    plural: "Featured boxes sections",
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: "featuredSectionTitle",
      type: "text",
      label: "Section title",
      defaultValue: "Popular boxes",
      admin: {
        description:
          "This section appears only when the shop is enabled. Card and link URLs are fixed in code.",
      },
    },
    {
      name: "featuredSectionSubtitle",
      type: "textarea",
      label: "Subtitle",
      defaultValue: "Packed for shipping — easy to buy for yourself or give as a gift.",
    },
    {
      name: "featuredSectionLinkText",
      type: "text",
      label: "Link to full shop",
      defaultValue: "All boxes →",
    },
    {
      name: "featuredBoxButtonLabel",
      type: "text",
      label: "Card button label",
      defaultValue: "Details",
    },
  ],
};

export const homePillarsBlock: Block = {
  slug: "homePillars",
  labels: {
    singular: "Three pillars",
    plural: "Three pillars sections",
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: "pillar1Title",
      type: "text",
      label: "Pillar 1 — title",
      defaultValue: "Local varieties",
    },
    {
      name: "pillar1Body",
      type: "textarea",
      label: "Pillar 1 — text",
      defaultValue: "Apples and pears from our orchards",
    },
    {
      name: "pillar2Title",
      type: "text",
      label: "Pillar 2 — title",
      defaultValue: "Transparent process",
    },
    {
      name: "pillar2Body",
      type: "textarea",
      label: "Pillar 2 — text",
      defaultValue: "Fermentation and ageing without shortcuts",
    },
    {
      name: "pillar3TitleWhenShopEnabled",
      type: "text",
      label: "Pillar 3 — title (shop ON)",
      defaultValue: "Gift-ready boxes",
    },
    {
      name: "pillar3BodyWhenShopEnabled",
      type: "textarea",
      label: "Pillar 3 — text (shop ON)",
      defaultValue: "Packed and ready to give",
    },
    {
      name: "pillar3TitleWhenShopDisabled",
      type: "text",
      label: "Pillar 3 — title (shop OFF)",
      defaultValue: "Contact & news",
    },
    {
      name: "pillar3LinkTextWhenShopDisabled",
      type: "text",
      label: "Pillar 3 — link label (shop OFF)",
      defaultValue: "Write to us",
    },
  ],
};

export const homePageLayoutBlocks: Block[] = [
  homeHeroBlock,
  homeFeaturedBoxesBlock,
  homePillarsBlock,
];
