
# Stage 1: Dependencies
FROM node:18-alpine AS deps

WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci


COPY . .


ARG NEXT_PUBLIC_API_URL=http://localhost:8000


ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# Stage 3: Production runner
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"


COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Run the application
CMD ["node", "server.js"]
