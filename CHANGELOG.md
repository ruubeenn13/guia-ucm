# Registro de cambios

Todos los cambios reseñables de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [No publicado]

### Hito 1 — Núcleo

#### Añadido

**Repositorio**

- Andamiaje del monorepo: estructura de carpetas, licencia MIT, política de seguridad,
  `.editorconfig`, `.gitignore` estricto y plantilla de variables de entorno.
- Integración continua en GitHub Actions: lint, comprobación de tipos, tests y build de frontend y
  backend en cada push y cada pull request, siempre en runners alojados por GitHub.
- Actualización automática de dependencias con Dependabot (npm, Maven, Docker y Actions).

**Base de datos**

- `V1__esquema.sql`: catálogo (sagas, bloques, títulos, opcionales), caché de TMDB (posters,
  sinopsis), cuentas (usuarios, códigos, refresh tokens) y datos de usuario (progreso,
  valoraciones, notas).
- `V2__seed.sql`: las 2 sagas, los 12 bloques temáticos, los 70 títulos de la guía y las 5
  secciones opcionales.

**API**

- `GET /api/v1/titulos` con el catálogo completo agrupado por saga y bloque, parámetro `?idioma=`
  para español e inglés, y los totales de progreso y de tiempo ya calculados.
- Manejo global de errores en formato RFC 9457, con mensajes genéricos que no filtran información.
- Documentación OpenAPI con springdoc, publicada solo con el perfil `dev`.
- Endpoints de salud y métricas de Prometheus en un puerto de gestión aparte.

**Web**

- Portada con tipografía de display y fondo por capas, preparada para recibir los *backdrops* de
  TMDB.
- Guía completa por sagas y bloques, con tarjetas protagonizadas por la carátula, número de orden,
  tipo con su color, año y duración.
- Tracker en modo invitado: marcar y desmarcar títulos, con el progreso guardado en el navegador.
- Conmutador de orden cronológico ↔ estreno.
- Barra fija con buscador que ignora tildes, filtros por tipo y por estado, y progreso «X/67·Y%».
- Panel de estadísticas de tiempo y calculadora de maratón de 1 a 4 horas al día.
- Banner «Siguiente para ver» con el primer título pendiente en orden cronológico.
- Temas claro y oscuro conmutables, persistidos y con el valor inicial del sistema, sin fogonazo
  al cargar.
- Diseño responsive de 320 px a 4K, con áreas táctiles de 44 px, foco visible, contraste AA y
  respeto por `prefers-reduced-motion`.
- Secciones opcionales, leyenda de tipos y notas al pie de la guía.
- Estados de carga con esqueletos y estados de error con botón de reintento.

**Infraestructura**

- Imágenes Docker multi-etapa para las dos mitades, ambas ejecutando como usuario sin privilegios.
- `docker-compose.yml` para el homelab, con etiquetas de Traefik y sin publicar la API.
- `docker-compose.dev.yml` con un MySQL 8.4 efímero para desarrollo local.
- Cabeceras de seguridad en Nginx, incluida una CSP con lista blanca explícita.

**Calidad**

- Tests unitarios de backend con JUnit 5 y de integración con Testcontainers contra un MySQL 8.4
  real.
- Tests unitarios de frontend con Vitest sobre las reglas del dominio.
- Smoke de punta a punta con Playwright, en escritorio y en móvil.

**Documentación**

- README raíz con arquitectura en Mermaid, arranque, variables, endpoints y tabla de licencias.
- Guías `docs/01-arquitectura`, `02-api`, `03-despliegue`, `04-seguridad` y `05-decisiones`.
- READMEs propios en `backend/`, `frontend/`, `docs/`, `features/` y el paquete raíz del backend.
