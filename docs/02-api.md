# 02 · API

Base: `/api/v1`. Todo se sirve como `application/json; charset=utf-8`.

Con el perfil `dev` hay Swagger UI en <http://localhost:8080/swagger-ui.html> y el documento
OpenAPI en `/v3/api-docs`. En producción los dos están **apagados**.

## Convenciones

- **Fechas** en UTC y formato ISO 8601. La conversión a hora local es cosa del navegador.
- **Campos nulos omitidos**: si un título no tiene duración, la clave `duracionMin` no aparece.
- **Errores** en formato RFC 9457 (`application/problem+json`).
- **Idioma** por parámetro `?idioma=es|en`. Si falta, español. Cualquier otro valor devuelve 400.

## `GET /api/v1/titulos`

Catálogo completo: sagas, bloques, títulos y secciones opcionales, resueltos al idioma pedido.

No se pagina. El tamaño es fijo —70 filas— y no depende de quien llama, así que no hay nada que
limitar; partirlo solo obligaría al cliente a encadenar peticiones para pintar la primera
pantalla.

Se sirve con `Cache-Control: public, max-age=3600`: el catálogo solo cambia cuando se despliega
una migración.

### Parámetros

| Nombre   | En      | Tipo   | Por defecto | Descripción              |
| -------- | ------- | ------ | ----------- | ------------------------ |
| `idioma` | consulta| string | `es`        | `es` o `en`              |

### Respuesta `200`

```jsonc
{
  "idioma": "es",
  "totalMarcables": 67,      // denominador del progreso
  "tiempoTotalMin": 10557,   // ≈176 h, sin la Saga de los Defensores
  "tiempoOpcionalMin": 8400, // ≈140 h, se muestran aparte
  "sagas": [
    {
      "numero": 1,
      "nombre": "Saga del Infinito",
      "bloques": [
        {
          "numero": 1,
          "nombre": "Los orígenes",
          "titulos": [
            {
              "id": 1,                 // orden cronológico
              "tipo": "pelicula",
              "titulo": "Capitán América: El Primer Vengador",
              "anio": "2011",
              "duracionMin": 124,
              "ordenEstreno": 5,
              "opcional": false,
              "agrupado": false,
              "cuentaEnTiempo": true,
              "marcable": true
            }
          ]
        }
      ]
    }
  ],
  "opcionales": [
    {
      "clave": "legado_tv",
      "nombre": "Legado Marvel TV",
      "items": ["Agentes de S.H.I.E.L.D. (2013–2020)", "…"]
    }
  ]
}
```

### Campos de un título

| Campo            | Tipo    | Qué significa                                                    |
| ---------------- | ------- | ---------------------------------------------------------------- |
| `id`             | entero  | Número de orden cronológico. Es su identificador en toda la API.  |
| `tipo`           | cadena  | `pelicula`, `serie`, `corto`, `especial`, `animacion` o `proxima`.|
| `titulo`         | cadena  | Ya resuelto al idioma pedido.                                     |
| `anio`           | cadena  | Año o rango, formateado: `2011`, `2015–2019`, `dic. 2026`.        |
| `duracionMin`    | entero  | Minutos. Ausente en lo que aún no se ha estrenado.                |
| `ordenEstreno`   | entero  | Posición por fecha de estreno, del 1 al 70.                       |
| `temporada`      | entero  | Temporada concreta, cuando una serie ocupa varias filas.          |
| `opcional`       | lógico  | Se puede saltar sin perderse la historia principal.               |
| `agrupado`       | lógico  | La fila es un conjunto de series, no un título; se pinta ancha.   |
| `cuentaEnTiempo` | lógico  | Suma en las estadísticas de tiempo.                               |
| `marcable`       | lógico  | Ya estrenado, luego se puede marcar como visto.                   |
| `nota`           | cadena  | Aclaración bajo el título, si la hay.                             |

### Ejemplos

```bash
curl 'http://localhost:8080/api/v1/titulos'
curl 'http://localhost:8080/api/v1/titulos?idioma=en'
curl -i 'http://localhost:8080/api/v1/titulos?idioma=fr'   # 400
```

## Errores

Formato único, sin trazas ni detalles internos:

```json
{
  "type": "about:blank",
  "title": "Solicitud incorrecta",
  "status": 400,
  "detail": "Idioma no soportado."
}
```

Los fallos de validación añaden un mapa `errores` con el campo y su motivo:

```json
{
  "type": "https://ucm.rubenlav.dev/errores/validacion",
  "title": "Datos no válidos",
  "status": 400,
  "detail": "Revisa los campos marcados.",
  "errores": { "email": "no es una dirección válida" }
}
```

| Código | Cuándo                                                        |
| ------ | ------------------------------------------------------------- |
| `400`  | Parámetro o cuerpo no válido                                  |
| `404`  | Ruta o recurso inexistente                                    |
| `405`  | Método no permitido                                           |
| `500`  | Fallo del servidor. El detalle solo queda en el log interno   |

## Endpoints de gestión

Escuchan en el **puerto 8081**, que el compose deja solo en la red interna de Docker: no salen a
internet ni pasan por Nginx.

| Ruta                   | Para qué                                    |
| ---------------------- | ------------------------------------------- |
| `/actuator/health`     | `healthcheck` del contenedor y Uptime Kuma  |
| `/actuator/prometheus` | Métricas para el Prometheus del homelab     |

## Pendiente

| Endpoint                              | Hito |
| ------------------------------------- | ---- |
| `POST /api/v1/auth/registro`          | 2    |
| `POST /api/v1/auth/verificar`         | 2    |
| `POST /api/v1/auth/login` · `login-2fa` | 2  |
| `POST /api/v1/auth/refresh` · `logout`| 2    |
| `GET/POST/DELETE /api/v1/progreso`    | 2    |
| `POST /api/v1/progreso/sync`          | 2    |
| `GET /api/v1/posters`                 | 3    |
| `GET /api/v1/detalle/{id}`            | 3    |
| `GET/PUT /api/v1/valoraciones`        | 3    |
