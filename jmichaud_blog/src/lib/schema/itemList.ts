import type { CollectionEntry } from "astro:content";
import { SITE } from "../../config/site";

/**
 * ItemList schema factory — used on /series/[seriesSlug] pages.
 *
 * Why ItemList and not Series?
 * Schema.org has a CreativeWorkSeries type, but Google has no defined
 * rich result surface for it and minimal documented support. ItemList
 * with ListItem + position is what Google actually processes and can
 * render in SERPs. Pragmatic choice over semantic purity.
 *
 * The @id on this ItemList matches the @id referenced in getArticleSchema
 * when a post declares series membership via isPartOf. This creates a
 * bidirectional link in the schema graph:
 *   Article → isPartOf → ItemList
 *   ItemList → itemListElement → ListItem → Article
 *
 * url on each ListItem points to /blog/[slug] — the flat post URL —
 * not to the series page. This is correct: the series page is a TOC,
 * not the content itself.
 *
 * @see https://schema.org/ItemList
 * @see https://schema.org/ListItem
 */
export function getItemListSchema(
  series: CollectionEntry<"series">,
  orderedPosts: CollectionEntry<"blog">[]
) {
  const seriesUrl = `${SITE.url}/series/${series.data.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    // Stable @id — referenced by Article schemas for series members
    "@id": `${seriesUrl}/#itemlist`,
    name: series.data.title,
    description: series.data.description,
    url: seriesUrl,
    numberOfItems: orderedPosts.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: orderedPosts.map((post, index) => ({
      "@type": "ListItem",
      // position is 1-indexed; prefer seriesPart if set (authoritative),
      // fall back to array index + 1 (positional, less reliable)
      position: post.data.seriesPart ?? index + 1,
      name: post.data.title,
      url: `${SITE.url}/blog/${post.id}`,
      description: post.data.description,
    })),
  } as const;
}

export type ItemListSchema = ReturnType<typeof getItemListSchema>;
