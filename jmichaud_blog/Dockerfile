# ============================================================
# Runtime — expects dist/ to be pre-built locally and rsynced in
# ============================================================
FROM node:22.15.0-alpine AS runtime

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# dist/ is rsynced from local machine before this image is built
COPY dist/ ./dist/

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]