# Documentación

Guías numeradas del proyecto. Se leen en orden, pero cada una se sostiene sola.

| Documento                              | Cuándo abrirlo                                                    |
| -------------------------------------- | ----------------------------------------------------------------- |
| [01 · Arquitectura](01-arquitectura.md)| Para entender cómo encajan las piezas y por qué están así          |
| [02 · API](02-api.md)                  | Para consumir o ampliar los endpoints                              |
| [03 · Despliegue](03-despliegue.md)    | Para poner esto en marcha en el homelab o actualizarlo             |
| [04 · Seguridad](04-seguridad.md)      | Para revisar medidas, amenazas y el repaso previo a publicar       |
| [05 · Decisiones](05-decisiones.md)    | Para saber por qué algo está hecho así y no de la otra forma       |

## Cómo se mantiene

- **Se documenta sobre la marcha.** Si un commit cambia el comportamiento, actualiza su
  documentación en ese mismo commit.
- **Las decisiones se registran, no se recuerdan.** Cualquier elección que alguien podría querer
  deshacer va a `05-decisiones.md` con su porqué.
- **Nada de placeholders vacíos.** Si una sección no tiene contenido todavía, se dice qué falta y
  en qué hito llega.

## Otros documentos

| Archivo                              | Contenido                                  |
| ------------------------------------ | ------------------------------------------ |
| [`../README.md`](../README.md)       | Presentación, arranque rápido y licencias  |
| [`../SECURITY.md`](../SECURITY.md)   | Cómo reportar una vulnerabilidad           |
| [`../CHANGELOG.md`](../CHANGELOG.md) | Qué ha cambiado en cada versión            |
| [`../backend/README.md`](../backend/README.md)   | Trabajar en la API             |
| [`../frontend/README.md`](../frontend/README.md) | Trabajar en la web             |
