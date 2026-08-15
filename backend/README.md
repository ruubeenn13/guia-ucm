# Backend · API de Guía UCM

Spring Boot 3.5 sobre Java 21, con Maven. Sirve el catálogo y, en los próximos hitos, las cuentas,
el progreso sincronizado y la caché de TMDB.

## Arrancar

Necesita el MySQL de desarrollo levantado desde la raíz del repositorio:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Y las variables del `.env` de la raíz cargadas en el entorno. Luego:

```bash
./mvnw spring-boot:run
```

- API: <http://localhost:8080/api/v1/titulos>
- Swagger UI (solo perfil `dev`): <http://localhost:8080/swagger-ui.html>
- Salud: <http://localhost:8081/actuator/health>

El wrapper de Maven descarga la distribución la primera vez; no hace falta tener Maven instalado,
solo un JDK 21.

## Estructura

```
src/main/java/dev/rubenlav/guiaucm/
├── GuiaUcmApplication.java   Punto de entrada; fija UTC como zona por defecto
├── config/                   CORS, OpenAPI y propiedades de la aplicación
├── comun/                    Idioma, excepciones propias y manejador global
└── catalogo/                 Vertical completa del catálogo
    ├── dominio/              Entidades JPA, enumerados y sus convertidores
    ├── dto/                  Lo que sale por la API (nunca una entidad)
    ├── CatalogoMapper        MapStruct, resuelve el idioma de paso
    ├── CatalogoService       Agrupa, ordena y calcula totales
    └── CatalogoController    GET /api/v1/titulos
```

```
src/main/resources/
├── application.yml           Común
├── application-dev.yml       Swagger abierto, logs habladores
├── application-prod.yml      Todo cerrado, logs en JSON
└── db/migration/             Flyway: V1 esquema, V2 datos
```

## Orden para una funcionalidad nueva

Siempre el mismo, y en este orden:

**Migración Flyway → Entidad → DTO → Mapper → Repository → Service → Controller → Seguridad.**

Si te saltas la migración y confías en Hibernate, el arranque falla: `ddl-auto` está en `validate`
a propósito.

## Base de datos

- **El esquema lo manda Flyway.** Nunca se toca la base a mano ni se cambia `ddl-auto`.
- **Una migración aplicada no se edita.** Cambiaría su suma de verificación y el arranque fallaría.
  Si hay que corregir algo, se escribe una migración nueva.
- Los enteros son `INT`/`BIGINT` y los enumerados `VARCHAR` con `CHECK`, para que la validación de
  esquema de Hibernate no falle por un desajuste de tipos. El porqué está en
  [`docs/05-decisiones.md`](../docs/05-decisiones.md#d-010--enteros-anchos-y-varchar-en-lugar-de-tinyint-y-enum).

## Tests

```bash
./mvnw test      # unitarios, sin Docker
./mvnw verify    # unitarios + integración (necesita Docker)
```

Los `*IT` levantan un **MySQL 8.4 real** con Testcontainers, aplican las migraciones y comprueban
el endpoint de punta a punta. Nunca se ejecutan contra una base de datos compartida.

Si Testcontainers no encuentra Docker con un error `400`, es que la versión de la API negociada
no le vale al Engine instalado:

```bash
./mvnw verify -Ddocker.api.version=1.44
```

## Convenciones

- `@RestController` devolviendo `ResponseEntity<>` o el DTO directamente.
- **DTOs explícitos siempre.** Una entidad no sale nunca por la API.
- MapStruct para el mapeo, con `unmappedTargetPolicy=ERROR`: si añades un campo al DTO y no lo
  mapeas, no compila.
- Lombok solo en entidades: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor`.
- Excepciones propias más un `@RestControllerAdvice` global. **Nunca capturar y callar.**
- Javadoc en los métodos públicos que no son evidentes.
- Endpoints documentados con `@Operation` y `@ApiResponse`.
- JPA para el CRUD normal; jOOQ solo si aparece una consulta que JPA haga fea de verdad.

## Imagen Docker

Multi-etapa: Maven compila, `eclipse-temurin:21-jre-alpine` ejecuta. El proceso corre como el
usuario `guiaucm`, nunca como root, y la imagen final no lleva ni Maven ni el código fuente.

```bash
docker build -t guia-ucm-api .
```
