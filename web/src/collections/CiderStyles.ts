import type { CollectionConfig } from "payload";

export const CiderStyles: CollectionConfig = {
  slug: "cider-styles",
  labels: { singular: "Cider style", plural: "Cider styles" },
  admin: {
    group: "Catalog",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "sortOrder", "updatedAt"],
    description:
      "Define filter options for the ciders catalogue. Slug is used in URLs (?style=slug). Create styles before assigning ciders.",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "label", type: "text", required: true, label: "Display name" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "Lowercase, use underscores if needed (e.g. semi_dry).",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      label: "Sort order",
      admin: { description: "Lower numbers appear first in filters." },
    },
  ],
};
