import type { Metadata } from "next";
import type { SiteSettingsData } from "@/lib/cms-globals";

/** Full document title + description; CMS title overrides the root title template when set. */
export function pageMetadata(
  settings: SiteSettingsData,
  options: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    /** Short title when CMS title is empty (combined with root template "%s | Site name"). */
    titleSegmentFallback: string;
    descriptionFallback: string;
  },
): Metadata {
  const titleTrim = options.metaTitle?.trim();
  const desc =
    options.metaDescription?.trim() || options.descriptionFallback;
  if (titleTrim) {
    return {
      title: { absolute: titleTrim },
      description: desc,
    };
  }
  return {
    title: options.titleSegmentFallback,
    description: desc,
  };
}

export function homeMetadata(settings: SiteSettingsData): Metadata {
  const title =
    settings.metaTitleHome?.trim() || "Sodo Sidrinė — cider from our orchard";
  const description =
    settings.metaDescriptionHome?.trim() ||
    "Lithuanian orchard cider: dry and sweeter styles, gift boxes. Sodo Sidrinė.";
  return {
    title: { absolute: title },
    description,
  };
}
