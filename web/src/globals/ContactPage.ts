import type { GlobalConfig } from "payload";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact page",
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
      defaultValue: "Contact us",
    },
    {
      name: "intro",
      type: "richText",
      label: "Intro",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      admin: { description: "Multi-line address or other contact details." },
    },
  ],
};
