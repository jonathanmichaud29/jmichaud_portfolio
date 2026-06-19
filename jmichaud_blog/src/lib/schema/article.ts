import type { CollectionEntry } from "astro:content";
import { SITE } from "../../config/site";

/**
 * Article schema factory — branches on post.data.type internally.
 *
 * TechArticle vs BlogPosting:
 * Both are siblings under Article in the Schema.org hierarchy.
 * Google treats both as eligible for article rich results.
 * The distinction is semantic correctness, not ranking strategy.
 *
 * TechArticle gets `proficiencyLevel` and `dependencies` when set —
 * these fields signal schema literacy to engineers inspecting your source.
 * They have no defined Google rich result surface today, but they are
 * valid Schema.org fields and cost nothing to include.
 *
 * author is a reference to the Person @id, not an inline object.
 * This links the article to your identity anchor in the schema graph
 * rather than repeating author metadata on every post.
 *
 * publisher mirrors author for a personal portfolio — you are both.
 * Some validators warn if publisher is absent on Article types.
 *
 * @see https://schema.org/TechArticle
 * @see https://schema.org/BlogPosting
 */
export function getArticleSchema(
  post: CollectionEntry<"blog">,
  series: CollectionEntry<"series"> | null,
  canonicalUrl: string
) {
  const { title, description, publishedAt, updatedAt, ogImage, tags } =
    post.data;

  // Shared fields across both article types
  const base = {
    "@context": "https://schema.org",
    headline: title,
    description,
    url: canonicalUrl,
    datePublished: publishedAt.toISOString(),
    dateModified: (updatedAt ?? publishedAt).toISOString(),
    image: ogImage
      ? `${SITE.url}${ogImage}`
      : `${SITE.url}${SITE.defaultOgImage}`,
    inLanguage: "en-CA",
    // Reference to the Person schema declared in BaseLayout.
    // Using @id reference avoids duplicating author metadata.
    author: {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
    },
    // isPartOf links this article back to the WebSite schema.
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
    },
    // keywords: flat array of tags — Schema.org expects a comma-separated
    // string, but Google accepts arrays. We use the array form; the
    // serializer in index.ts calls JSON.stringify which handles it correctly.
    keywords: tags,
  };

  // Series membership: if this post belongs to a series, declare it as
  // isPartOf an additional ItemList. This links the article to its
  // series context in the schema graph.
  const seriesPartOf = series
    ? {
        "@type": "ItemList",
        "@id": `${SITE.url}/series/${series.data.slug}/#itemlist`,
        name: series.data.title,
      }
    : null;

  if (post.data.type === "tech-article") {
    const { proficiencyLevel, dependencies, seriesPart } = post.data;

    return {
      ...base,
      "@type": "TechArticle",
      // proficiencyLevel: Schema.org field, valid values are free-text.
      // We map our enum to human-readable strings.
      ...(proficiencyLevel && {
        proficiencyLevel:
          proficiencyLevel.charAt(0).toUpperCase() + proficiencyLevel.slice(1),
      }),
      // dependencies: tools/runtimes required to follow the article.
      ...(dependencies && dependencies.length > 0 && { dependencies }),
      // position within series if applicable
      ...(seriesPart !== undefined && { position: seriesPart }),
      // Link to series ItemList if this post is a series member
      ...(seriesPartOf && {
        isPartOf: [base.isPartOf, seriesPartOf],
      }),
    };
  }

  // blog-post type
  const { seriesPart } = post.data;

  return {
    ...base,
    "@type": "BlogPosting",
    ...(seriesPart !== undefined && { position: seriesPart }),
    ...(seriesPartOf && {
      isPartOf: [base.isPartOf, seriesPartOf],
    }),
  };
}

export type ArticleSchema = ReturnType<typeof getArticleSchema>;
