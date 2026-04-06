import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About page",
  admin: {
    group: "Site",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Heading",
      defaultValue: "The orchard that becomes cider",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Hero image",
    },
    {
      name: "body",
      type: "richText",
      label: "Body",
    },
  ],
};
