# ── Etapa 1: construcción ────────────────────────────────────────────
FROM node:26-alpine AS construccion

WORKDIR /app

# Las dependencias se copian solas primero para que Docker reutilice la
# capa de `npm ci` mientras no cambie el package-lock.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa 2: servidor ────────────────────────────────────────────────
# Imagen sin privilegios: el proceso corre como el usuario 101, nunca
# como root. Por eso escucha en el 8080 y no en el 80.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS servidor

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construccion --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/salud || exit 1
