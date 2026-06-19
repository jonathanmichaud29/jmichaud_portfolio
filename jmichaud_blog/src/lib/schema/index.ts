/**
 * Schema composition and serialization.
 *
 * This is the only file layouts should import from src/lib/schema/.
 * Re-exports all factory functions so call sites have one import path,
 * and provides composeSchema() + serializeSchema() for the <head> output.
 *
 * Usage in a layout:
 *
 *   import { composeSchema, getArticleSchema, getBreadcrumbSchema } from "../lib/schema";
 *
 *   const schema = composeSchema([
 *     getArticleSchema(post, series, canonicalUrl),
 *     getBreadcrumbSchema([
 *       { name: "Blog", path: "/blog" },
 *       { name: post.data.title, path: `/blog/${post.id}` },
 *     ]),
 *   ]);
 *
 *   // In <head>:
 *   <Fragment set:html={serializeSchema(schema)} />
 *
 * Why a @graph array?
 * Multiple schema types on one page should be declared as a single
 * @graph rather than multiple <script> tags. Google's documentation
 * explicitly recommends the @graph pattern for combining types.
 * It also allows cross-referencing between types via @id on the same page.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/sd-policies
 */

export { getWebSiteSchema } from "./website";
export { getPersonSchema } from "./person";
export { getArticleSchema } from "./article";
export { getBreadcrumbSchema } from "./breadcrumb";
export { getItemListSchema } from "./itemList";

export type { WebSiteSchema } from "./website";
export type { PersonSchema } from "./person";
export type { ArticleSchema } from "./article";
export type { BreadcrumbSchema } from "./breadcrumb";
export type { BreadcrumbItem } from "./breadcrumb";
export type { ItemListSchema } from "./itemList";

// The union of all schema types this module can produce.
// Extend this when new schema types are added.
type AnySchema =
  | ReturnType<typeof import("./website").getWebSiteSchema>
  | ReturnType<typeof import("./person").getPersonSchema>
  | ReturnType<typeof import("./article").getArticleSchema>
  | ReturnType<typeof import("./breadcrumb").getBreadcrumbSchema>
  | ReturnType<typeof import("./itemList").getItemListSchema>;

/**
 * Combines multiple schema objects into a single JSON-LD @graph.
 *
 * The @context is hoisted to the top-level wrapper — individual schema
 * objects passed in do declare their own @context (so they remain valid
 * if used standalone), but the graph wrapper is what gets serialized.
 */
export function composeSchema(schemas: AnySchema[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map((schema) => {
      // Strip the top-level @context from each individual schema —
      // it belongs on the graph wrapper, not on each node.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { "@context": _context, ...rest } = schema as Record<string, unknown>;
      return rest;
    }),
  };
}

/**
 * Serializes a composed schema graph to a <script> tag string.
 *
 * Use with Astro's set:html directive to inject into <head>:
 *   <Fragment set:html={serializeSchema(schema)} />
 *
 * Why set:html and not a <script> tag with JSON.stringify inline?
 * Astro escapes content inside {expressions} in template literals,
 * which breaks JSON. set:html bypasses escaping, which is safe here
 * because we control the input entirely — no user content reaches
 * the schema graph.
 */
export function serializeSchema(
  schema: ReturnType<typeof composeSchema>
): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
