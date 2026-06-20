## Zod

Using `z.url()` standalone syntax (Zod v4 Classic API), NOT `z.string().url()`.
`astro/zod` re-exports Zod v4. Verified against:

- https://zod.dev/api (z.url() documented)
- https://docs.astro.build/en/reference/modules/astro-zod/

## Astro v5

Astro removed hybrid as a named output mode in v5. It was merged into server. The equivalent is now:

```ts
export default defineConfig({
  site: "https://www.jmichaud.ca",
  output: "server",
  // ...
});
```

The behaviour is identical to what hybrid was — pages are static by default, and you opt individual routes into SSR by adding export const prerender = false at the top of that file. Your contact form endpoint will use that directive. Everything else prerenders as static HTML.
