# Frontend · Web de Guía UCM

React 19 con Vite y TypeScript estricto. Es lo que ve la gente: la portada, la guía, el tracker y
las estadísticas.

## Arrancar

```bash
npm ci
npm run dev        # http://localhost:5173
```

Vite hace de proxy de `/api` hacia `http://localhost:8080`, así que la API tiene que estar
levantada (ver [`../backend/README.md`](../backend/README.md)). El código solo conoce rutas
relativas: no hay ninguna URL de servidor escrita, ni en desarrollo ni en producción.

## Comandos

| Comando              | Qué hace                                                   |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con recarga en caliente             |
| `npm run build`      | Comprueba tipos y construye a `dist/`                      |
| `npm run preview`    | Sirve `dist/` para mirar el resultado real                 |
| `npm run lint`       | ESLint con reglas basadas en tipos                         |
| `npm run typecheck`  | TypeScript, sin generar nada                               |
| `npm run format`     | Prettier sobre todo el proyecto                            |
| `npm run test`       | Vitest                                                     |
| `npm run test:e2e`   | Playwright (necesita la API y Vite en marcha)              |

## Estructura

```
src/
├── app/              Raíz: proveedores, cabecera y pie
├── features/         Una carpeta por funcionalidad → features/README.md
├── components/ui/    Piezas reutilizables sin lógica de negocio
├── hooks/            Hooks transversales (tema)
├── services/         Cliente de la API, tipado
├── styles/           tokens.css: toda la paleta
├── tipos/            Tipos compartidos, calcados de los DTO del backend
└── utils/            Texto (búsqueda sin tildes) y tiempo (duraciones)
e2e/                  Smoke con Playwright
public/               favicon y el arranque del tema
```

## Cómo se decide dónde va algo

- ¿Es una regla de la guía (qué cuenta, cómo se ordena, cuánto queda)? → función pura en
  `features/<x>/modelo.ts`, con su test.
- ¿Es una pieza visual que no sabe nada del dominio (botón, chip, esqueleto)? → `components/ui/`.
- ¿Es una pieza visual que sí sabe del dominio (tarjeta de título, barra de filtros)? →
  `features/<x>/componentes/`.
- ¿Habla con el servidor? → `services/api.ts`, y el hook de consulta junto a su funcionalidad.

## Estilos

Toda la paleta son variables CSS en `styles/tokens.css`, con nombres semánticos
(`--c-superficie`, `--c-texto-suave`, `--tipo-pelicula`) y una redefinición completa bajo
`[data-tema='oscuro']`. Tailwind las consume con `@theme inline`, así que `bg-superficie` cambia
sola al conmutar el tema.

**Ningún componente escribe un color literal.** Si necesitas uno nuevo, añade el token en los dos
temas.

Reglas que no se rompen:

- Contraste **AA** en los dos temas.
- Áreas táctiles de **44 px** como mínimo en cualquier control (clase `tactil`).
- Foco visible siempre; nada de `outline: none`.
- `aria-label` en todo botón que sea solo un icono.
- `prefers-reduced-motion` respetado: las animaciones se desactivan solas.
- De **320 px a 4K**: rejilla fluida con `auto-fill` + `minmax`, tipografía con `clamp()`.

## Estado

| Qué                      | Dónde                       |
| ------------------------ | --------------------------- |
| Catálogo (del servidor)  | TanStack Query              |
| Progreso (de la persona) | Zustand + `localStorage`    |
| Filtros (de la pantalla) | `useState` en `PaginaGuia`  |

El progreso vive en `features/progreso/estado.ts`. Es lo que en el hito 2 se mandará a
`POST /api/v1/progreso/sync` al iniciar sesión, así que su formato importa: se versiona.

## Tests

- **Vitest** para las funciones puras de `modelo.ts`: filtrado, agrupación, estadísticas y
  siguiente para ver. Ahí están documentadas las reglas raras (qué cuenta y qué no).
- **Playwright** para el flujo feliz, en escritorio y en móvil: entrar, marcar, comprobar que el
  progreso sobrevive a recargar, buscar sin tildes, cambiar el orden y conmutar el tema.

```bash
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

## Convenciones

- Solo componentes funcionales con hooks. Sin clases.
- PascalCase para componentes, camelCase para funciones y variables.
- JSDoc en las props y en las funciones exportadas.
- Nada de `any`: ESLint lo rechaza.
- Nada de `dangerouslySetInnerHTML`.
