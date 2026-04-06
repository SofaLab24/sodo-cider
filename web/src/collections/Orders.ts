import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "Order", plural: "Orders" },
  admin: {
    useAsTitle: "stripeCheckoutSessionId",
    defaultColumns: ["stripeCheckoutSessionId", "status", "customerEmail", "amountTotalCents", "createdAt"],
    hidden: process.env.NEXT_PUBLIC_ENABLE_SHOP === "false",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      unique: true,
      label: "Stripe Checkout session ID",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "paid",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Pending", value: "pending" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { name: "customerEmail", type: "email", label: "Customer email" },
    {
      name: "amountTotalCents",
      type: "number",
      required: true,
      label: "Amount (cents)",
    },
    { name: "currency", type: "text", defaultValue: "eur", label: "Currency" },
    {
      name: "lineItems",
      type: "json",
      label: "Line items (JSON)",
      admin: { description: "Cart summary from checkout." },
    },
  ],
};
