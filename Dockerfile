# Multi-stage Dockerfile for CloudMed (BACSE344 Cloud Deployment)

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Backend & Production Server
FROM node:18-alpine AS runner
WORKDIR /app

# Copy backend
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/

# Copy built frontend assets to server static folder
COPY --from=frontend-builder /app/client/dist ./server/public

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server/server.js"]
