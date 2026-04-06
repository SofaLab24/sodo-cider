import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: {
    group: "Site",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Social",
          fields: [
            {
              name: "instagramUrl",
              type: "text",
              label: "Instagram URL",
              admin: { description: "Full URL, e.g. https://www.instagram.com/sodo_cider/" },
            },
            {
              name: "facebookUrl",
              type: "text",
              label: "Facebook URL",
              admin: { description: "Full URL to the page or profile." },
            },
          ],
        },
        {
          label: "Brand & navigation",
          fields: [
            {
              name: "siteName",
              type: "text",
              label: "Site name (header logo)",
              defaultValue: "Sodo Sidrinė",
            },
            {
              name: "navCidersLabel",
              type: "text",
              label: "Menu: Ciders (/ciders)",
              defaultValue: "Ciders",
            },
            {
              name: "navShopLabel",
              type: "text",
              label: "Menu: Shop (/shop)",
              defaultValue: "Shop",
            },
            {
              name: "navAboutLabel",
              type: "text",
              label: "Menu: About (/about)",
              defaultValue: "About",
            },
            {
              name: "navContactLabel",
              type: "text",
              label: "Menu: Contact (/contact)",
              defaultValue: "Contact",
            },
            {
              name: "navCartLabel",
              type: "text",
              label: "Menu: Cart (/cart)",
              defaultValue: "Cart",
            },
          ],
        },
        {
          label: "Page titles & SEO",
          fields: [
            {
              name: "metaTitleHome",
              type: "text",
              label: "Home — browser title",
            },
            {
              name: "metaDescriptionHome",
              type: "textarea",
              label: "Home — meta description",
            },
            {
              name: "metaTitleCiders",
              type: "text",
              label: "Ciders — browser title",
            },
            {
              name: "metaDescriptionCiders",
              type: "textarea",
              label: "Ciders — meta description",
            },
            {
              name: "metaTitleAbout",
              type: "text",
              label: "About — browser title",
            },
            {
              name: "metaDescriptionAbout",
              type: "textarea",
              label: "About — meta description",
            },
            {
              name: "metaTitleContact",
              type: "text",
              label: "Contact — browser title",
            },
            {
              name: "metaDescriptionContact",
              type: "textarea",
              label: "Contact — meta description",
            },
            {
              name: "metaTitleShop",
              type: "text",
              label: "Shop — browser title",
            },
            {
              name: "metaDescriptionShop",
              type: "textarea",
              label: "Shop — meta description",
            },
            {
              name: "metaTitleCart",
              type: "text",
              label: "Cart — browser title",
            },
            {
              name: "metaDescriptionCart",
              type: "textarea",
              label: "Cart — meta description",
            },
            {
              name: "metaTitlePrivacy",
              type: "text",
              label: "Privacy — browser title",
            },
            {
              name: "metaDescriptionPrivacy",
              type: "textarea",
              label: "Privacy — meta description",
            },
            {
              name: "metaTitleTerms",
              type: "text",
              label: "Terms — browser title",
            },
            {
              name: "metaDescriptionTerms",
              type: "textarea",
              label: "Terms — meta description",
            },
            {
              name: "metaTitleShipping",
              type: "text",
              label: "Shipping — browser title",
            },
            {
              name: "metaDescriptionShipping",
              type: "textarea",
              label: "Shipping — meta description",
            },
          ],
        },
      ],
    },
  ],
};
