# 03 · Despliegue

Entorno de destino: homelab con **Traefik v3** detrás de un **Cloudflare Tunnel**, y un **MySQL
8.4** ya desplegado que se reutiliza.

## Piezas

| Servicio       | Imagen                                | Puerto | Sale a internet |
| -------------- | ------------------------------------- | ------ | --------------- |
| `guia-ucm-web` | Nginx sin privilegios + estáticos      | 8080   | Sí, vía Traefik |
| `guia-ucm-api` | `eclipse-temurin:21-jre-alpine`        | 8080   | No              |
| —              | Actuator de la API                     | 8081   | No              |
| MySQL 8.4      | El del stack que ya existe             | 3306   | No              |

## 1 · Base de datos

En el MySQL existente, con un usuario propio y nunca con `root`:

```sql
CREATE DATABASE guia_ucm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'guia_ucm'@'%' IDENTIFIED BY 'una_password_larga_y_aleatoria';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, REFERENCES
  ON guia_ucm.* TO 'guia_ucm'@'%';

FLUSH PRIVILEGES;
```

Los permisos de DDL hacen falta porque Flyway crea y modifica las tablas en cada despliegue.

Añade `guia_ucm` a la rotación de backups del homelab, junto al resto de bases:

```bash
# en mysql-dump.sh
BASES="... guia_ucm"
```

Y comprueba que Backrest se lleva el directorio de volcados.

## 2 · Colocar el stack

El repositorio se clona como un stack más del homelab:

```
homelab/
└── stacks/
    └── guia-ucm/          ← este repositorio
        ├── docker-compose.yml
        ├── .env           ← no versionado
        ├── frontend/
        └── backend/
```

```bash
cd stacks
git clone https://github.com/ruubeenn13/guia-ucm.git
cd guia-ucm
cp .env.example .env
$EDITOR .env
```

## 3 · Ajustes del compose

Dos cosas que hay que tocar antes del primer arranque:

**La red del MySQL.** Mira cómo se llama de verdad:

```bash
docker network ls | grep -i mysql
```

y sustituye el marcador en `docker-compose.yml`:

```yaml
networks:
  basedatos:
    external: true
    name: mysql_default # ← el nombre real
```

**El certresolver de Traefik.** Está comentado a propósito porque depende del comodín que ya
tengas configurado:

```yaml
labels:
  # traefik.http.routers.guia-ucm.tls.certresolver: <certresolver-wildcard>
```

## 4 · Arrancar

```bash
docker compose up -d --build
docker compose logs -f guia-ucm-api
```

En el primer arranque, Flyway aplica `V1` y `V2` y deja el catálogo cargado. Si la base de datos
no coincidiera con las entidades, la aplicación **no arranca**: es intencionado.

Comprobaciones:

```bash
docker compose ps                                   # los dos «healthy»
curl -s localhost:8080/api/v1/titulos | head -c 200 # desde dentro de la red
```

## 5 · Cloudflare Access ⚠️

`*.rubenlav.dev` está protegido por correo. **Si no se hace nada, la guía pedirá autenticación a
todo el mundo y dejará de ser pública.**

Hay que crear una aplicación o una regla de *bypass* para `ucm.rubenlav.dev`, igual que el «Paso
libre» que ya existe:

1. Cloudflare Zero Trust → **Access → Applications**.
2. Nueva aplicación de tipo *Self-hosted*, dominio `ucm.rubenlav.dev`.
3. Política **Bypass** con el selector *Everyone*.

Verifícalo desde una ventana de incógnito antes de dar el despliegue por bueno.

## 6 · Monitorización

**Uptime Kuma**: monitor HTTP(s) contra `https://ucm.rubenlav.dev/salud`, que devuelve `ok` sin
tocar la base de datos y sin aparecer en el log de accesos. Notificación por **ntfy**, como el
resto de stacks.

**Prometheus**: la API expone `/actuator/prometheus` en el puerto 8081, dentro de la red de
Docker. Añade el objetivo al `prometheus.yml` existente:

```yaml
- job_name: guia-ucm-api
  metrics_path: /actuator/prometheus
  static_configs:
    - targets: ['guia-ucm-api:8081']
```

El contenedor de Prometheus tiene que estar en la red `interna` del stack para poder alcanzarlo.

## Actualizar

```bash
cd stacks/guia-ucm
git pull
docker compose up -d --build
```

Las migraciones nuevas se aplican solas al arrancar. Antes de una que toque datos, un volcado:

```bash
docker exec mysql mysqldump -u root -p guia_ucm > guia_ucm_$(date +%F).sql
```

## Volver atrás

```bash
git checkout <etiqueta-anterior>
docker compose up -d --build
```

Flyway **no deshace** migraciones. Si hay que revertir un cambio de esquema, se escribe una
migración nueva que lo corrija; nunca se edita una ya aplicada, porque cambiaría su suma de
verificación y el arranque fallaría.

## Problemas frecuentes

| Síntoma                                   | Causa probable                                        |
| ----------------------------------------- | ----------------------------------------------------- |
| La API reinicia sin parar                 | `DB_URL`, `DB_USER` o `DB_PASS` mal, o falta la red    |
| `Schema-validation: missing table`        | Flyway no llegó a correr: mira sus permisos de DDL     |
| `Validate failed: checksum mismatch`      | Se editó una migración ya aplicada                     |
| Cloudflare pide iniciar sesión            | Falta la regla de *bypass* del paso 5                  |
| 502 desde Traefik                         | La API aún no está `healthy`; mira `docker compose ps` |
| Las carátulas no cargan                   | `TMDB_API_KEY` vacía o caducada (hito 3)               |
