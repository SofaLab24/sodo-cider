import type { CollectionConfig } from "payload";

export const Boxes: CollectionConfig = {
  slug: "boxes",
  labels: { singular: "Box", plural: "Boxes" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "priceEur", "inStock", "updatedAt"],
    description:
      "Shop SKUs. A Stripe Price ID (price_…) is required for checkout — create the product in Stripe and paste it here.",
    hidden: process.env.NEXT_PUBLIC_ENABLE_SHOP === "false",
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
      admin: { description: "URL: /shop/[slug]" },
    },
    { name: "description", type: "textarea", label: "Description" },
    {
      name: "priceEur",
      type: "number",
      required: true,
      min: 0,
      label: "Price (EUR)",
      admin: { description: "Shown on the site; should match the Stripe price." },
    },
    {
      name: "stripePriceId",
      type: "text",
      label: "Stripe Price ID (not Product ID)",
      admin: {
        description:
          "Must be price_… (Checkout line_items). Not prod_… — Dashboard → Products → open product → Pricing → copy the price API ID.",
      },
    },
    {
      name: "inStock",
      type: "checkbox",
      defaultValue: true,
      label: "In stock",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image",
    },
    {
      name: "containsCiders",
      type: "relationship",
      relationTo: "ciders",
      hasMany: true,
      label: "Contents (ciders)",
    },
  ],
};
