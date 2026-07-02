# Personnal Portfolio

## Tech Stack

Portfolio Website

- Framework : Astro (SSG + Node adapter for SSR endpoints)
- UI Components : React (islands only — forms, interactive demos)
- CSS : Tailwind CSS v4 + @tailwindcss/typography
- Code Highlight : Shiki (build-time, zero client JS)
- Content : MDX via Astro Content Collections (Git-based)
- Search : Pagefind (static index, WASM client)
- Email : Resend (contact form)
- Database : None
- Auth : None
- Containerized : Docker (single Nginx container for static output + optional Node container for SSR endpoint)
- CI/CD : ArgoCD + Helm (already in stack)
- Secrets : HashiCorp Vault → K8s Secret → env var

## How to access webpages

### Local HMR

**Homepage** : http://localhost:4321/
**About** : http://localhost:4321/about

**Blog** : http://localhost:4321/blog
**Single post** : http://localhost:4321/blog/hello-world
**Single post in a serie** : http://localhost:4321/blog/docker-networking-pt1
**Serie's posts** : http://localhost:4321/series/docker-networking

### Production build simulation

**Homepage** : http://localhost:8080/

## Local usefull commands

### Docker

```bash
**# Which containers are running**
docker-compose ps

**# Check Nginx logs**
docker-compose logs nginx

**# Check Astro Node logs**
docker-compose logs node
```

### Astro

```bash
# Validate Typescript and Schema
pnpm astro check

# Build the application for prod usage
pnpm build

# Create a production environment, locally at http://172.20.0.2:4321
make prod-local

# Build docker local containers, then with detached mode
make dev
make dev-d
```

# TODO

- [x] Finalize CSS for desktop/tablet/mobile
- [] Create and validate SEO
- [] Create contact form endpoint
- [x] Download Resume
- [] Test build
- [] Create real blog entries
- [] Validate final texts
- [] Deploy Production

# How to create new serie of blogs

1. Add the series entry to src/content/series/index.json — append a new object with a unique id/slug, title, description, publishedAt (date of first part), updatedAt, order (empty-ish, build up as you publish parts), status: "active", and optional repoUrl/demoUrl.

2. Create the first post in src/content/blog/<series-slug>-pt1.mdx with frontmatter:

```text
type: tech-article   # or blog-post
title: "..."
description: "..."
publishedAt: YYYY-MM-DD
series: <series-id>
seriesPart: 1
tags: [...]
(see docker-networking-pt1.mdx as the template)
```

3. Add that post's slug to the series' order array in index.json, in reading order — this is what drives the "latest part" link, so every slug listed must have a matching .mdx file or the build breaks per the schema comment.

4. For each subsequent part, repeat steps 2–3 (-pt2.mdx, -pt3.mdx, …), bumping seriesPart and appending to order, and bump the series' updatedAt.

5. Verify — /series/<slug> page (src/pages/series/[seriesSlug].astro) and individual post pages render automatically from the collection; no routing code needed. Run the dev server and check both.
