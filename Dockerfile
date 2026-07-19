# Multi-stage build for Next.js + Python FastAPI Unified Container
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Install Python and OpenCV system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy FastAPI backend code
COPY backend/app ./backend/app
COPY backend/weights ./backend/weights
COPY backend/requirements.txt ./backend/requirements.txt
COPY backend/.env ./backend/.env

# Setup Python Virtual Environment and install backend dependencies
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir -r backend/requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Write a startup script to run both Next.js and FastAPI
RUN echo '#!/bin/sh\n\
echo "Starting FastAPI backend locally..."\n\
/app/venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 &\n\
echo "Starting Next.js frontend on port \$PORT..."\n\
exec node server.js\n\
' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
