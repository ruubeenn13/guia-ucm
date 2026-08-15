# 04 · Seguridad

Qué se protege, de qué y cómo. Para **reportar** un fallo, ve a [`SECURITY.md`](../SECURITY.md).

## Qué hay que proteger

Poca cosa, y es deliberado: de cada persona se guardan **el correo, el hash de la contraseña y la
fecha en la que aceptó los términos**. El resto son datos de visionado, que no son sensibles pero
sí personales, y por tanto solo suyos.

La superficie real de ataque es la autenticación (hito 2) y la exposición de datos ajenos.

## Lo que ya está

### Contenedores

- Los dos corren **sin privilegios**: la web con la imagen `nginx-unprivileged` (usuario 101) y la
  API con un usuario `guiaucm` creado en el Dockerfile.
- `no-new-privileges:true` en el compose: un proceso no puede escalar por *setuid*.
- Imágenes *alpine* y multi-etapa: en la imagen final no hay ni Maven, ni Node, ni el código
  fuente.
- **La API no publica puertos.** No tiene `ports` en el compose: solo la alcanza Nginx, por la red
  interna.

### Cabeceras HTTP

Las pone Nginx en `frontend/nginx.conf`, con `always` para que también viajen en las respuestas de
error:

| Cabecera                     | Valor                                            |
| ---------------------------- | ------------------------------------------------ |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains; preload`   |
| `X-Content-Type-Options`     | `nosniff`                                        |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                |
| `Permissions-Policy`         | cámara, micrófono y ubicación denegados          |
| `Cross-Origin-Opener-Policy` | `same-origin`                                    |

### CSP con lista blanca

```
default-src 'self';
script-src  'self';
style-src   'self' 'unsafe-inline';
img-src     'self' data: https://image.tmdb.org;
font-src    'self';
connect-src 'self';
frame-src   https://www.youtube-nocookie.com;
object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';
```

- **Imágenes**: solo las nuestras y las carátulas de TMDB.
- **Iframes**: solo el reproductor de YouTube sin cookies, para los tráilers.
- **Scripts**: `'self'` a secas, sin `unsafe-inline`. Por eso el arranque del tema vive en
  `public/tema.js` y no en línea en el HTML.
- **`style-src`** sí admite estilos en línea: las animaciones escriben el atributo `style` de los
  elementos que mueven, y no hay forma de evitarlo sin renunciar a ellas. El riesgo de un
  `style-src` permisivo es muy inferior al de uno de scripts.
- **Fuentes autoalojadas**: no se pide nada a servidores de terceros, ni siquiera una tipografía.

### Errores que no cuentan de más

Un único manejador global convierte cualquier excepción en `application/problem+json` con:

- mensaje genérico y en castellano;
- sin traza, sin nombre de clase, sin consulta;
- el detalle real solo en el log del servidor.

`server.error.include-message: never` y sus hermanas cierran también la página de error por
defecto de Spring.

### Superficie mínima

- **Swagger y `/v3/api-docs` apagados en producción.** No hace falta publicar el mapa de la API.
- **Actuator en otro puerto** (8081) que no sale de la red de Docker, y con `show-details: never`.
- Nginx devuelve `404` a cualquier `/actuator` que llegue por el puerto público, por si acaso.
- `server_tokens off`: no se anuncia la versión de Nginx.

### Base de datos

- Acceso solo con **JPA y consultas parametrizadas**. Cero SQL concatenado.
- El usuario de la aplicación tiene permisos sobre `guia_ucm` y nada más. Nunca `root`.
- `ddl-auto: validate`: si el esquema y las entidades se separan, la aplicación no arranca. Es una
  red de seguridad, no un inconveniente.
- Restricciones `CHECK` en la propia base para lo que no debe entrar (`valor` entre 1 y 5, tipos
  válidos, duraciones positivas).

### Secretos

- Todo por variable de entorno. **Ni una credencial en el repositorio.**
- `.env` está en `.gitignore`; lo único versionado es `.env.example`, con valores de mentira.
- La clave de TMDB solo la usa el backend: jamás llega al navegador.
- En GitHub, **secret scanning** y **Dependabot** activos.

### Cadena de suministro

- `npm ci` y `mvn` con versiones fijadas por `package-lock.json` y el BOM de Spring Boot.
- Dependabot abre PRs semanales de npm y Maven, y mensuales de Docker y Actions.
- La CI corre en **runners alojados por GitHub**, nunca self-hosted: en un repositorio público, un
  runner propio permitiría a una PR de un fork ejecutar código dentro del homelab.

## Lo que llega con las cuentas (hito 2)

| Medida                        | Detalle                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| Contraseñas                   | BCrypt con coste 12; se rechazan las más comunes                |
| Códigos y tokens              | Guardados **hasheados** (SHA-256), nunca en claro               |
| Access token                  | JWT de 15 minutos                                               |
| Refresh token                 | Cookie `httpOnly` `Secure` `SameSite=Lax`, rotativo             |
| Revocación                    | Al cerrar sesión y al cambiar la contraseña                     |
| Enumeración de cuentas        | Respuesta idéntica exista o no el correo, en registro, login y reset |
| Fuerza bruta                  | Límite por IP y por cuenta, con bloqueo progresivo              |
| Códigos de un solo uso        | Máximo 5 intentos, caducidad de 15 min (30 en el reset)         |
| Cuentas sin verificar         | Borradas a los 7 días por tarea programada                      |
| Borrado de cuenta             | Inmediato y en cascada: progreso, valoraciones y notas          |

## Modelo de amenazas

| Amenaza                                   | Mitigación                                                |
| ----------------------------------------- | ---------------------------------------------------------- |
| Robo de credenciales por fuerza bruta     | BCrypt 12 + límite de intentos + bloqueo progresivo         |
| Enumeración de correos                    | Mensajes y tiempos de respuesta uniformes                   |
| XSS                                       | React escapa por defecto; nada de `dangerouslySetInnerHTML`; CSP sin `unsafe-inline` en scripts |
| Inyección SQL                             | JPA y consultas parametrizadas                              |
| CSRF                                      | Cookie `SameSite=Lax` + token en cabecera, no en cookie     |
| Clickjacking                              | `frame-ancestors 'none'`                                    |
| Fuga de la clave de TMDB                  | Solo vive en el backend; el cliente nunca la ve             |
| Ver el progreso de otra persona           | Toda consulta filtra por el usuario del token               |
| Escapar del contenedor                    | Usuario sin privilegios + `no-new-privileges` + imagen mínima |
| Dependencia comprometida                  | Dependabot, `npm audit` y bloqueo de versiones              |
| Un fork ejecutando código en el homelab   | CI solo en runners de GitHub                                |

## Repaso antes de publicar

- [ ] `.env` fuera de git y `git check-ignore -v .env` lo confirma
- [ ] `JWT_SECRET` generado con `openssl rand -base64 64`
- [ ] `SPRING_PROFILES_ACTIVE=prod` en el servidor
- [ ] Swagger inaccesible desde fuera
- [ ] `curl -I https://ucm.rubenlav.dev` devuelve HSTS y CSP
- [ ] La API no responde desde internet
- [ ] `npm audit` y el análisis de dependencias sin vulnerabilidades conocidas
- [ ] Páginas legales completadas con los datos del titular
- [ ] Regla de *bypass* de Cloudflare Access verificada en incógnito
