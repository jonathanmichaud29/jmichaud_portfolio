import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.discriminatedUnion("type", [
    z
      .object({
        type: z.literal("tech-article"),
        title: z.string(),
        description: z.string(),
        publishedAt: z.coerce.date(),
        updatedAt: z.date().optional(),
        proficiencyLevel: z
          .enum(["beginner", "intermediate", "expert"])
          .optional(),
        dependencies: z.array(z.string()).optional(),
        series: reference("series").optional(),
        seriesPart: z.number().int().optional(),
        canonicalUrl: z.url().optional(),
        noindex: z.boolean().default(false),
        ogImage: z.string().optional(),
        tags: z
          .array(
            z
              .string()
              .toLowerCase()
              .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Tags must be lowercase kebab-case"
              )
          )
          .default([]),
        readingTime: z.number().int().positive().optional(),
      })
      .refine(
        (data) => !(data.seriesPart !== undefined && data.series === undefined),
        {
          message: "seriesPart requires series to be set",
          path: ["seriesPart"],
        }
      ),
    z
      .object({
        type: z.literal("blog-post"),
        title: z.string(),
        description: z.string(),
        publishedAt: z.coerce.date(),
        updatedAt: z.date().optional(),
        series: reference("series").optional(),
        seriesPart: z.number().int().optional(),
        canonicalUrl: z.url().optional(),
        noindex: z.boolean().default(false),
        ogImage: z.string().optional(),
        tags: z
          .array(
            z
              .string()
              .toLowerCase()
              .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Tags must be lowercase kebab-case"
              )
          )
          .default([]),
        readingTime: z.number().int().positive().optional(),
      })
      .refine(
        (data) => !(data.seriesPart !== undefined && data.series === undefined),
        {
          message: "seriesPart requires series to be set",
          path: ["seriesPart"],
        }
      ),
  ]),
});

const series = defineCollection({
  loader: file("src/content/series/index.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    // publishedAt: when the first part was published.
    // Set once on series creation — never updated after that.
    // Used as datePublished in the JSON-LD ItemList for the series index page.
    publishedAt: z.coerce.date(),
    // updatedAt: bumped manually each time a new part is published.
    // This is the sort key used by getLatestFeedItems — not publishedAt.
    // Signals "this series was recently active" independently of any single post.
    updatedAt: z.coerce.date(),
    // ogImage: optional editorial override for the series card and og:image.
    // When absent, the query helper falls back to the latest post's ogImage.
    ogImage: z.string().optional(),
    // order: slugs of PUBLISHED parts only, in reading order (pt1 first).
    // - Used to determine the latest part: highest index = highest seriesPart.
    // - Never list a slug here without a corresponding .mdx file — the query
    //   helper resolves the latest part href from this array, and a dangling
    //   slug produces a broken link with no build-time error.
    // - min(1): a series with zero published parts is a data error and will
    //   fail the build explicitly rather than silently producing a broken card.
    order: z.array(z.string()).min(1),
    status: z.enum(["active", "completed"]),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
  }),
});

export const collections = { blog, series };
