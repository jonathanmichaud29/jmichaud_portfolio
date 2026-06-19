import { SITE } from "../../config/site";

/**
 * Person schema — declared once in BaseLayout, on every page.
 *
 * This is the identity anchor that downstream Article schemas reference
 * via `author: { "@id": personId }`. Declaring it here rather than
 * inline in every article schema means your author metadata is defined
 * once and linked — not duplicated and potentially inconsistent.
 *
 * The @id URI is a stable identifier, not a dereferenceable URL.
 * Convention: {siteUrl}/#person — distinct from the WebSite @id.
 *
 * sameAs: Links your schema identity to authoritative external profiles.
 * Google uses sameAs to build a knowledge panel. LinkedIn and GitHub
 * are the two most credible signals for a developer.
 *
 * @see https://schema.org/Person
 */
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.title,
    description: SITE.description,
    sameAs: [SITE.social.github, SITE.social.linkedin],
  } as const;
}

export type PersonSchema = ReturnType<typeof getPersonSchema>;
