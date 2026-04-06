import type { CollectionConfig } from "payload";

export const Ciders: CollectionConfig = {
  slug: "ciders",
  labels: { singular: "Cider", plural: "Ciders" },
  admin: {
    group: "Catalog",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "style", "available", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL segment, e.g. apple-dry" },
    },
    {
      name: "style",
      type: "relationship",
      relationTo: "cider-styles",
      required: true,
      label: "Style (catalog filter)",
      admin: {
        description: "Managed under Catalog → Cider styles.",
      },
    },
    { name: "shortDescription", type: "textarea", label: "Short description" },
    {
      name: "longDescription",
      type: "richText",
      label: "Long description",
    },
    { name: "abv", type: "number", label: "ABV %", min: 0, max: 20 },
    { name: "volumeMl", type: "number", label: "Volume (ml)", min: 0 },
    {
      name: "tastingNotes",
      type: "textarea",
      label: "Tasting notes",
      admin: { description: "One per line or comma-separated." },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      label: "Featured image",
    },
    {
      name: "gallery",
      type: "array",
      label: "Gallery",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Image",
        },
      ],
    },
    {
      name: "available",
      type: "checkbox",
      defaultValue: true,
      label: "Available / visible in catalog",
    },
  ],
};
