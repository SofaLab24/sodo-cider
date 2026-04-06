import type { GlobalConfig } from "payload";

import { homePageLayoutBlocks } from "@/blocks/homePageBlocks";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home page (landing)",
  admin: {
    group: "Site",
    description: "Reorder sections below. Hero / featured / pillars use fixed URLs in code where noted.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "layout",
      type: "blocks",
      label: "Page sections",
      blocks: homePageLayoutBlocks,
      admin: {
        initCollapsed: false,
        description:
          "Each gray bar is one section: use the grip to drag, the row to expand/collapse, ⋯ for duplicate/remove. Add Hero + Three pillars for a full page. Featured boxes only show on the site when the shop is enabled. If nothing would render, defaults fill in once.",
      },
    },
  ],
};
