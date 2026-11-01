import type { TStudio } from "@/lib/type/type";

/**
 * Canonical mapping between backend category names and the URL slugs used by
 * /studios?category=... links. Keep this in sync with the categories rendered
 * on the studios page.
 */
export const categoryNameToSlug: Record<string, string> = {
  "Photo Studio": "photography",
  "Film Stage": "film",
  "Podcast Lounge": "podcast",
  "Music Suite": "music",
  "Content Creation Studio": "content",
  Workshop: "workshop",
  "Dance Studio": "dance",
  "Meeting Space": "meeting",
};

export const categorySlugToName: Record<string, string> = Object.fromEntries(
  Object.entries(categoryNameToSlug).map(([name, slug]) => [slug, name]),
);

/**
 * Return every usable image for a studio.
 *
 * Newer documents use `imageUrls`; some older documents only have the
 * singular `imageUrl` field, so both are supported.
 */
export function getStudioImages(
  studio?: Pick<TStudio, "imageUrls" | "imageUrl"> | null,
): string[] {
  const images =
    studio?.imageUrls?.filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    ) ?? [];

  if (images.length > 0) {
    return images;
  }

  const legacyImage = studio?.imageUrl?.trim();

  return legacyImage ? [legacyImage] : [];
}

export function getStudioCoverImage(
  studio?: Pick<TStudio, "imageUrls" | "imageUrl"> | null,
): string | undefined {
  return getStudioImages(studio)[0];
}
