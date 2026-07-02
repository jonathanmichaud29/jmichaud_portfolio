import type { CollectionEntry } from "astro:content";
import { SITE } from "../../config/site";

/**
 * CollectionPage schema factory — used on /blog and /blog/page/[page].
 *
 * CollectionPage is the correct Schema.org type for a paginated listing
 * of articles. It is a subtype of WebPage, which Google understands and
 * indexes. This schema helps Google understand the structure of the blog
 * index and its relationship to the individual articles it lists.
 *
 * hasPart references each article shown on the page by URL. This creates
 * a bidirectional link with the Article schemas on individual post pages,
 * which declare isPartOf pointing back to the WebSite. The collection page
 * sits between them in the graph: WebSite → CollectionPage → Articles.
 *
 * @see https://schema.org/CollectionPage
 */
export function getCollectionPageSchema(
  name: string,
  description: string,
  canonicalUrl: string,
  posts: CollectionEntry<"blog">[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collectionpage`,
    name,
    description,
    url: canonicalUrl,
    inLanguage: "en-CA",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
    },
    hasPart: posts.map((post) => ({
      "@type": "Article",
      url: `${SITE.url}/blog/${post.id}`,
      name: post.data.title,
      description: post.data.description,
    })),
  };
}

export type CollectionPageSchema = ReturnType<typeof getCollectionPageSchema>;
