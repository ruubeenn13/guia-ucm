# dev.rubenlav.guiaucm

Un paquete por funcionalidad, con su vertical completa dentro. Nada de un paquete `controllers` y
otro `services` con todo mezclado.

## Paquetes

| Paquete     | De qué se ocupa                                                        |
| ----------- | ---------------------------------------------------------------------- |
| `config/`   | CORS, OpenAPI y las propiedades de la aplicación (`guia-ucm.*`)         |
| `comun/`    | Idiomas, excepciones propias y el manejador global de errores           |
| `catalogo/` | Sagas, bloques, títulos y secciones opcionales                          |

Pendientes: `auth/`, `progreso/` y `valoraciones/` (hito 2); `tmdb/` (hito 3).

## Forma de un paquete de funcionalidad

```
<nombre>/
├── dominio/               Entidades JPA, enumerados y sus convertidores
├── dto/                   Lo que sale por la API. Records.
├── <Nombre>Mapper.java    MapStruct: entidad → DTO
├── <Nombre>Repository.java
├── <Nombre>Service.java   Reglas de negocio y transacciones
└── <Nombre>Controller.java
```

## Reglas

- **Controller → Service → Repository.** El controlador no toca el repositorio ni de casualidad.
- **Una entidad no sale nunca por la API.** Siempre un DTO, y siempre un record.
- **MapStruct con `unmappedTargetPolicy=ERROR`.** Si añades un campo al DTO y se te olvida
  mapearlo, no compila. Es intencionado.
- **Los enumerados se persisten con un `AttributeConverter`**, no con `@Enumerated(STRING)`: así
  renombrar una constante Java no rompe los datos en silencio.
- **`@Transactional(readOnly = true)`** en todo lo que solo lee.
- **Nunca capturar y callar.** Si algo falla, o se maneja o sube al `@RestControllerAdvice`.
- **Los mensajes de error no cuentan nada.** Ni si un recurso existe, ni por qué falló de verdad.
  El detalle solo va al log.

## Orden para algo nuevo

**Migración Flyway → Entidad → DTO → Mapper → Repository → Service → Controller → Seguridad.**

Empezar por la migración no es burocracia: Hibernate arranca con `ddl-auto: validate`, así que sin
ella la aplicación no levanta.

## Idiomas

Los textos del catálogo están en la base de datos en las dos lenguas (`nombre_es` / `nombre_en`).
Quien resuelve cuál toca es la entidad, con un método `nombre(Idioma)`, y el mapper lo llama
pasando el idioma como `@Context`. Los DTOs salen ya resueltos: el cliente no ve nunca las dos
versiones.
