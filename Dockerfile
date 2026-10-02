# syntax=docker/dockerfile:1

# ===== basis =====
FROM node:22-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ===== dependensi (di-cache terpisah) =====
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# ===== build =====
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# generate Prisma client di dalam container Linux supaya engine-nya
# cocok dengan OS image runner (jangan pakai hasil generate dari Windows)
RUN npx prisma generate && npm run build

# ===== runtime =====
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# openssl dibutuhkan engine Prisma; ca-certificates untuk outbound HTTPS
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY deploy/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
 && mkdir -p /data /app/uploads
# database SQLite dan avatar harus persisten di volume
VOLUME ["/data", "/app/uploads"]
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
