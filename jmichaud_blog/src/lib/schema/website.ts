import { SITE } from "../../config/site";

/**
 * WebSite schema — declared once in BaseLayout, on every page.
 *
 * Rationale for SearchAction: Sitelinks Searchbox eligibility requires
 * a WebSite schema with a SearchAction pointing to your search URL.
 * Pagefind runs client-side, so the target URL uses a query param pattern.
 * Google may or may not surface the searchbox — declaring it correctly
 * costs nothing and makes you eligible.
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/sitelinks-searchbox
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en-CA",
    potentialAction: {
      "@type": "SearchAction",
      // Pagefind exposes results at /?search={query} by convention.
      // Update this path if you implement a dedicated /search route.
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;
}

export type WebSiteSchema = ReturnType<typeof getWebSiteSchema>;
