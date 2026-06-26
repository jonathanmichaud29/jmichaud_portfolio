import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

// ---------------------------------------------------------------------------
// FeedItem
//
// Normalised shape consumed by any page that renders a list of latest content
// (homepage, /blog index, RSS feed). Both variants expose identical rendering
// fields (title, description, publishedAt, href, ogImage) so card components
// never need to branch on `kind` just to display content.
//
// `kind` is available for cases that genuinely need to discriminate:
//   - showing a "Series · N parts" badge
//   - different aria-label on the card link
//   - JSON-LD type on a future /blog listing page
// ---------------------------------------------------------------------------

export type StandaloneFeedItem = {
  kind: "standalone";
  post: CollectionEntry<"blog">;
  // Shared rendering surface
  title: string;
  description: string;
  publishedAt: Date;
  href: string;
  ogImage: string | undefined;
};

export type SeriesFeedItem = {
  kind: "series";
  series: CollectionEntry<"series">;
  // latestPost: the part with the highest seriesPart value among published parts.
  // href points directly to this post — not to /series/[slug].
  // Rationale: a visitor arriving from the homepage wants to read new content,
  // not re-navigate a TOC they may have already seen.
  latestPost: CollectionEntry<"blog">;
  // Shared rendering surface
  title: string;
  description: string;
  // publishedAt here is series.data.updatedAt — the explicit editorial signal
  // that this series was recently active. Used as the sort key.
  publishedAt: Date;
  href: string;
  // ogImage fallback chain: series.ogImage → latestPost.ogImage → undefined
  // The undefined case is handled downstream by the card component using
  // SITE.defaultOgImage as its own fallback.
  ogImage: string | undefined;
  partCount: number;
};

export type FeedItem = StandaloneFeedItem | SeriesFeedItem;

// ---------------------------------------------------------------------------
// getLatestFeedItems(limit)
//
// Returns `limit` FeedItems sorted by publishedAt descending, where:
//   - each standalone post appears as one item
//   - each series collapses to one item regardless of part count
//
// noindex posts are excluded — they are drafts or pages intentionally
// hidden from crawlers, and should not be surfaced to users either.
// ---------------------------------------------------------------------------
export async function getLatestFeedItems(limit: number): Promise<FeedItem[]> {
  const [allPosts, allSeries] = await Promise.all([
    getCollection("blog", ({ data }) => !data.noindex),
    getCollection("series"),
  ]);

  // Index posts by their series reference id for O(1) lookup.
  // post.data.series is a CollectionEntry reference { id, collection }
  // when declared with reference() in the schema, or undefined for standalone.
  const postsBySeriesId = new Map<string, CollectionEntry<"blog">[]>();
  for (const post of allPosts) {
    if (!post.data.series) continue;
    const sid = post.data.series.id;
    const bucket = postsBySeriesId.get(sid) ?? [];
    bucket.push(post);
    postsBySeriesId.set(sid, bucket);
  }

  // --- Series feed items ---
  const seriesItems: SeriesFeedItem[] = [];

  for (const s of allSeries) {
    const parts = postsBySeriesId.get(s.id) ?? [];

    if (parts.length === 0) {
      // Series exists in index.json but no published .mdx files reference it.
      // This is a content authoring error — skip rather than crash.
      // The build will catch the root cause via the Zod min(1) on order[].
      continue;
    }

    // Determine the latest part by highest seriesPart value.
    // seriesPart is the authoritative ordering signal — it is explicit and
    // intentional. Sorting by publishedAt would break if a part is ever
    // backfilled, corrected, or published out of chronological order.
    //
    // Parts without seriesPart (seriesPart === undefined) sort to the front
    // (treated as 0), so they are never incorrectly selected as "latest"
    // over a numbered part. This is a data quality guard, not a valid state —
    // every part in a series should have seriesPart set.
    const latestPost = parts.reduce((best, candidate) => {
      const bestPart = best.data.seriesPart ?? 0;
      const candidatePart = candidate.data.seriesPart ?? 0;
      return candidatePart > bestPart ? candidate : best;
    });

    seriesItems.push({
      kind: "series",
      series: s,
      latestPost,
      title: s.data.title,
      description: s.data.description,
      // Sort key: series.updatedAt — bumped manually when a new part publishes.
      // This is the editorial "last active" signal, not the post's own date.
      publishedAt: s.data.updatedAt,
      href: `/blog/${latestPost.id}`,
      // ogImage fallback chain: series override → latest post's image → undefined
      ogImage: s.data.ogImage ?? latestPost.data.ogImage,
      partCount: parts.length,
    });
  }

  // --- Standalone feed items ---
  const standaloneItems: StandaloneFeedItem[] = allPosts
    .filter((p) => !p.data.series)
    .map((post) => ({
      kind: "standalone",
      post,
      title: post.data.title,
      description: post.data.description,
      publishedAt: post.data.publishedAt,
      href: `/blog/${post.id}`,
      ogImage: post.data.ogImage,
    }));

  return [...standaloneItems, ...seriesItems]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// getAllPostsSortedDesc()
//
// Returns ALL published blog posts (standalone + series members) sorted by
// publishedAt descending. noindex posts are excluded.
//
// Used by the /blog paginated index.
//
// Design decision: /blog shows every individual post, including series parts.
// Rationale:
//   - /blog is the exhaustive archive — users expect to find every post here.
//   - Series parts are surfaced as individual cards with a series badge,
//     so the reader can see them in chronological context.
//   - The homepage's "Currently working on" block handles editorial curation
//     of active series — that's the right place to collapse series to one card.
//   - Hiding 2 of 3 posts because they belong to a series is a broken listing
//     from a reader's perspective.
//
// The return type is CollectionEntry<"blog">[] (not FeedItem[]) because the
// /blog index works directly with the collection entry for type-safe field
// access (tags, type, readingTime, seriesPart) without FeedItem normalisation.
// ---------------------------------------------------------------------------
export async function getAllPostsSortedDesc(): Promise<
  CollectionEntry<"blog">[]
> {
  const posts = await getCollection("blog", ({ data }) => !data.noindex);

  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}
