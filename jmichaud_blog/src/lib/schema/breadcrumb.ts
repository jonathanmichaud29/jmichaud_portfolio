import { SITE } from "../../config/site";

export interface BreadcrumbItem {
  name: string;
  /** Relative path — e.g. "/blog" or "/blog/docker-networking-pt1" */
  path: string;
}

/**
 * BreadcrumbList schema factory.
 *
 * Call sites pass relative paths; the factory resolves absolute URLs.
 * The homepage is always the implicit first crumb — do NOT include it
 * in the items array. The factory prepends it automatically so call
 * sites stay DRY and the root crumb is never accidentally omitted.
 *
 * Usage:
 *   getBreadcrumbSchema([
 *     { name: "Blog", path: "/blog" },
 *     { name: "Docker Networking — Part 1", path: "/blog/docker-networking-pt1" },
 *   ])
 *
 * Renders in SERPs as: jmichaud.ca > Blog > Docker Networking — Part 1
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const allItems: BreadcrumbItem[] = [{ name: SITE.name, path: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      // position is 1-indexed per Schema.org spec
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  } as const;
}

export type BreadcrumbSchema = ReturnType<typeof getBreadcrumbSchema>;
