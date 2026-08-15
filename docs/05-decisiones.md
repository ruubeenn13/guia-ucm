# 05 · Decisiones

Registro breve de cada decisión técnica y su porqué. Se añade una entrada en el mismo commit que
introduce el cambio.

---

## D-001 · Monorepo público

**Decisión.** Frontend y backend en un único repositorio público con licencia MIT.

**Por qué.** Los cambios de contrato tocan las dos mitades a la vez; en un monorepo eso es un solo
commit que la CI valida entero y un solo `docker compose up` al desplegar.

**Consecuencia.** Al ser público: `.gitignore` estricto, secret scanning, Dependabot y CI
exclusivamente en runners de GitHub.

---

## D-002 · El catálogo vive en la base de datos, no en un JSON

**Decisión.** Los 70 títulos se cargan con una migración de Flyway (`V2__seed.sql`) en lugar de
ir en un archivo estático del frontend.

**Por qué.** Progreso, valoraciones y notas necesitan una clave foránea real contra los títulos, y
la caché de TMDB también. Además, el panel de administración del hito 3 podrá añadir estrenos sin
tocar la base a mano.

**Alternativa descartada.** Un JSON en el frontend: más rápido de arrancar, pero deja el progreso
sin integridad referencial y obliga a duplicar el catálogo en el backend en cuanto entra TMDB.

---

## D-003 · `titulos.id` es el orden cronológico

**Decisión.** El identificador de un título es su número de orden cronológico, y el orden de
estreno es otra columna con índice único.

**Por qué.** El orden cronológico es la razón de ser de la guía y es estable. Usar un
autoincremento sin significado obligaría a un `ORDER BY` extra en cada consulta y a una columna
más.

**Riesgo asumido.** Si algún día se insertara un título en medio, habría que renumerar. Es un
evento raro y una migración lo resuelve.

---

## D-004 · 67 marcables sobre 70 filas

**Decisión.** El denominador del progreso son los títulos con `marcable = TRUE`: 70 filas menos
las 3 aún sin estrenar.

**Por qué.** Nadie puede haber visto lo que no ha salido; incluirlo haría imposible llegar al
100 %.

**Nota.** La Saga de los Defensores sí es marcable, aunque sea opcional. Lo que queda fuera es su
tiempo, no su check.

---

## D-005 · La Saga de los Defensores no cuenta en el tiempo

**Decisión.** Columna `cuenta_en_tiempo`, en `FALSE` solo para esa fila. Sus ≈140 h se muestran
aparte.

**Por qué.** Son más de la mitad del tiempo total de la guía y son opcionales. Metidas en el
cálculo, la calculadora de maratón daría un número desalentador y falso para casi todo el mundo.

---

## D-006 · El catálogo no se pagina

**Decisión.** `GET /api/v1/titulos` devuelve las 70 filas en una sola respuesta, aunque la norma
del proyecto sea paginar todos los listados con tope.

**Por qué.** El tamaño es fijo y **no depende de quien llama**, así que no hay superficie de abuso
que limitar. Paginarlo obligaría al cliente a encadenar peticiones para pintar la primera
pantalla, a cambio de nada.

**Dónde sí se aplica la norma.** En los listados que crecen con datos del usuario (progreso,
valoraciones) y en los futuros endpoints de administración.

---

## D-007 · React 19 en lugar de React 18

**Decisión.** Se usa React 19, que es lo que instala hoy el andamiaje de Vite.

**Por qué.** La especificación pedía React 18, pero 19 es la versión estable actual, todas las
dependencias elegidas la soportan y fijar la anterior solo añadiría deuda desde el primer día. El
código no usa nada exclusivo de 19: bajar de versión sería mecánico si hiciera falta.

---

## D-008 · Tailwind CSS 4 sobre variables CSS propias

**Decisión.** La paleta son variables CSS semánticas en `styles/tokens.css`, expuestas a Tailwind
con `@theme inline`.

**Por qué.** El tema claro/oscuro se conmuta redefiniendo variables bajo `[data-tema='oscuro']`,
sin duplicar clases `dark:` por toda la aplicación. Tailwind aporta la parte responsive sin
escribir *media queries* a mano.

---

## D-009 · La lógica derivada, en funciones puras

**Decisión.** Filtrar, agrupar y calcular estadísticas vive en `features/catalogo/modelo.ts`, sin
React de por medio.

**Por qué.** Se prueba con Vitest en milisegundos y sin montar componentes, y los tests documentan
las reglas raras (qué cuenta y qué no) mejor que un comentario.

---

## D-010 · Enteros anchos y `VARCHAR` en lugar de `TINYINT` y `ENUM`

**Decisión.** Todas las claves y contadores son `INT`/`BIGINT` con signo, y los enumerados son
`VARCHAR` con una restricción `CHECK`.

**Por qué.** `ddl-auto: validate` compara el tipo de cada columna con el de la entidad. `TINYINT
UNSIGNED` contra un `Integer`, o `ENUM` contra un `String`, hacen fallar el arranque. Ese
guardarraíl vale mucho más que los bytes ahorrados en una tabla de 70 filas.

**Extra.** El `CHECK` mantiene la validación de valores dentro de la base de datos y, a diferencia
de `ENUM`, no es específico de MySQL.

---

## D-011 · Un `AttributeConverter` en vez de `@Enumerated(STRING)`

**Decisión.** `TipoTitulo` y `MediaTmdb` se persisten con un `AttributeConverter` explícito.

**Por qué.** `@Enumerated(STRING)` guarda el nombre de la constante Java. Renombrar la constante
rompería los datos en silencio; con el convertidor, la cadena que va a la base es un valor
declarado aparte.

---

## D-012 · Nginx sin privilegios en el puerto 8080

**Decisión.** El contenedor web usa `nginxinc/nginx-unprivileged` y escucha en el 8080, así que la
etiqueta de Traefik apunta a ese puerto y no al 80 del ejemplo original.

**Por qué.** Un proceso sin privilegios no puede abrir un puerto por debajo del 1024. Correr como
root solo para escuchar en el 80 es peor negocio que cambiar un número en una etiqueta.

---

## D-013 · El arranque del tema, en un archivo aparte

**Decisión.** `public/tema.js` en lugar de un `<script>` en línea dentro de `index.html`.

**Por qué.** Permite una CSP con `script-src 'self'` sin nonces ni hashes que mantener en cada
build. El coste es una petición diminuta y cacheable.

---

## D-014 · Versión de la API de Docker fijada en los tests

**Decisión.** El plugin de Failsafe pasa `-Dapi.version=1.44` a los tests de integración.

**Por qué.** El cliente que usa Testcontainers negocia por defecto una versión de la API de Docker
anterior a la mínima que aceptan los Engine recientes (29.x exige 1.40 o superior) y recibe un
`400`. La versión 1.44 la admite todo lo desplegado desde Docker 25.

**Cómo cambiarlo.** `./mvnw verify -Ddocker.api.version=X.YY`.

---

## D-015 · Una tabla `sagas` aparte

**Decisión.** Existe una tabla `sagas` además de `bloques`, aunque la especificación solo
enumeraba la segunda.

**Por qué.** El nombre de la saga es un dato con dos traducciones y se repite en los seis bloques
que cuelgan de ella. Duplicarlo doce veces invita a que un día no coincidan.

---

## D-016 · Título en inglés derivado, con excepciones explícitas

**Decisión.** `titulos.titulo_en` está a `NULL` por defecto: el título en inglés se saca de
`busqueda_tmdb`, que es el título original, quitando el prefijo «Marvel One-Shot: ».

**Por qué.** Evita duplicar 70 cadenas que ya están en la tabla.

**Excepciones.** Las temporadas sueltas (`Loki T2` → `Loki S2`) y la agrupación de los Defensores
no encajan en la regla, y ahí sí se guarda el valor explícito.
