# syntax=docker/dockerfile:1
#
# Runtime image only: run `npm run lint` and `npm run build` in CI (or locally)
# before `docker build`. The build context must include a fresh `.next` output.
#
# Example (from repo root):
#   cd web && npm ci && npm run lint && npm run build && cd .. && docker build -f web/Dockerfile web

ARG NODE_VERSION=22.4.1
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN test -f .next/BUILD_ID || (echo "Missing .next build output. Run npm run build before docker build." >&2 && exit 1)
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]
