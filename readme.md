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
**Single post** : http://localhost:4321/blog/hello-world
**Single post in a serie** : http://localhost:4321/blog/docker-networking-pt1
**Serie's posts** : http://localhost:4321/series/docker-networking

### Production build simulation

**Homepage** : http://localhost:8080/
\*\*

## Local Docker usefull commands

**# Which containers are running**
docker-compose ps

**# Check Nginx logs**
docker-compose logs nginx

**# Check Astro Node logs**
docker-compose logs node
