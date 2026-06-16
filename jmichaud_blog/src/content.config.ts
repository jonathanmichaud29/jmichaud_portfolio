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
    order: z.array(z.string()),
  }),
});

export const collections = { blog, series };
