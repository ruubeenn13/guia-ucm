# features/

Una carpeta por funcionalidad, no por tipo de archivo. Todo lo que hace falta para que algo
funcione vive junto: su modelo, su hook de datos y sus componentes.

## Qué hay

| Carpeta      | De qué se ocupa                                                            |
| ------------ | -------------------------------------------------------------------------- |
| `catalogo/`  | La guía: descarga del catálogo, filtros, orden, agrupación y tarjetas       |
| `progreso/`  | Lo que ha visto cada persona: estado persistido, estadísticas y maratón     |

Pendientes: `auth/` (hito 2) y `compartir/` (hito 3).

## Forma de una funcionalidad

```
features/<nombre>/
├── modelo.ts          Funciones puras: reglas del dominio. Sin React.
├── modelo.test.ts     Sus tests. Rápidos, sin montar nada.
├── estado.ts          Estado persistido, si lo necesita (Zustand)
├── use<Nombre>.ts     Hook de datos (TanStack Query)
├── Pagina<Nombre>.tsx Composición de la pantalla
└── componentes/       Piezas visuales que sí conocen el dominio
```

No todas las funcionalidades tienen todas las piezas: `progreso` no descarga nada del servidor
todavía, así que no tiene hook de consulta.

## La regla que ordena todo

**Las reglas del dominio son funciones puras.** Filtrar, agrupar, calcular estadísticas o decidir
cuál es el siguiente título por ver son funciones que reciben datos y devuelven datos, sin tocar
React ni el DOM.

Esto compra tres cosas:

1. Los tests corren en milisegundos y sin montar componentes.
2. Las reglas raras del dominio quedan documentadas en los tests, no en un comentario que
   envejece: por qué el denominador son 67 y no 70, por qué la Saga de los Defensores se marca
   pero no suma tiempo.
3. Los componentes solo deciden cómo se pinta, y se leen del tirón.

Si te encuentras escribiendo un `useMemo` con quince líneas de lógica, ese código pertenece a
`modelo.ts`.

## Qué no va aquí

- Piezas visuales que no saben nada del dominio (botón, chip, esqueleto): van en
  `../components/ui/`.
- El cliente HTTP: va en `../services/api.ts`.
- Los tipos que devuelve la API: van en `../tipos/`.
