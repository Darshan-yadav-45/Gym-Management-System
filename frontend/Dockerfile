# ── Build Stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Cache node dependencies
COPY package*.json ./
RUN npm ci

# Copy sources and compile Vite production bundle
COPY . .
RUN npm run build

# ── Serve Stage ─────────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
