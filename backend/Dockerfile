# ── Etapa 1: construcción ────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS construccion

WORKDIR /app

# Primero solo el pom: así la descarga de dependencias se cachea y no se
# repite en cada cambio de código.
COPY pom.xml .
RUN mvn --batch-mode --no-transfer-progress dependency:go-offline

COPY src ./src
# Los tests de integración necesitan Docker y ya se ejecutan en la CI:
# aquí solo se construye el artefacto.
RUN mvn --batch-mode --no-transfer-progress -DskipTests package

# ── Etapa 2: ejecución ───────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine AS ejecucion

# Usuario sin privilegios: nada corre como root.
RUN addgroup --system --gid 1001 guiaucm \
    && adduser --system --uid 1001 --ingroup guiaucm guiaucm

WORKDIR /app
COPY --from=construccion --chown=guiaucm:guiaucm /app/target/guia-ucm-api.jar app.jar

USER guiaucm

# 8080 = API pública (a través de Nginx). 8081 = actuator, que el compose
# deja solo en la red interna de Docker.
EXPOSE 8080 8081

# `MaxRAMPercentage` deja que la JVM respete el límite de memoria del
# contenedor en lugar de mirar la RAM del anfitrión.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
