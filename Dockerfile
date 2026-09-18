# ==============================================================================
# NeuroSaathi - Multi-Stage Production Dockerfile
# Builds the React Vite frontend and serves both REST API + Frontend SPA
# via production-grade multi-threaded WSGI server on a single port.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend SPA
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Python WSGI Container
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# Copy built frontend assets from Stage 1 into web/dist
COPY --from=frontend-builder /app/web/dist ./web/dist

# Expose production port
EXPOSE 5000

# Initialize SQLite database and run Waitress production WSGI server
CMD ["python", "backend/prod_server.py"]
