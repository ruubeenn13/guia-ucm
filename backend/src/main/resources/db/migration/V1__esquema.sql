-- ─────────────────────────────────────────────────────────────────────
--  Guía UCM — esquema inicial
--
--  MySQL 8.4 · InnoDB · utf8mb4.
--  Todas las fechas se guardan en UTC; la conversión a la zona horaria
--  del usuario se hace en el navegador.
--
--  Los enteros son INT/BIGINT con signo a propósito. Los tipos estrechos
--  (TINYINT, SMALLINT) y el modificador UNSIGNED no encajan con los tipos
--  de Java y harían fallar la validación de esquema de Hibernate, que
--  corre en cada arranque y es la red que garantiza que la base de datos y
--  el código no se separen. El ahorro de bytes sería irrelevante: aquí la
--  tabla más grande tiene 70 filas.
-- ─────────────────────────────────────────────────────────────────────

-- =====================================================================
--  CATÁLOGO
-- =====================================================================

-- Las dos sagas en las que se divide la guía.
CREATE TABLE sagas (
    numero    INT          NOT NULL,
    nombre_es VARCHAR(120) NOT NULL,
    nombre_en VARCHAR(120) NOT NULL,
    PRIMARY KEY (numero)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- Bloques temáticos dentro de cada saga. `numero` es el orden del bloque
-- dentro de su saga, no un identificador global.
CREATE TABLE bloques (
    id        INT          NOT NULL AUTO_INCREMENT,
    saga      INT          NOT NULL,
    numero    INT          NOT NULL,
    nombre_es VARCHAR(120) NOT NULL,
    nombre_en VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_bloques_saga_numero (saga, numero),
    CONSTRAINT fk_bloques_saga FOREIGN KEY (saga) REFERENCES sagas (numero)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- Títulos de la guía.
--
--   id             número de orden CRONOLÓGICO (es la clave de negocio y la
--                  que usan `progreso`, `valoraciones`, `notas`, `posters`
--                  y `sinopsis`).
--   orden_estreno  posición en el orden por fecha de estreno.
--   titulo_en      NULL = el título en inglés se deriva de `busqueda_tmdb`
--                  quitando el prefijo «Marvel One-Shot: ». Se rellena solo
--                  cuando esa regla no sirve (temporadas y agrupaciones).
--   temporada      temporada concreta cuando un título representa una sola
--                  temporada de una serie; necesaria porque varias filas
--                  comparten la misma búsqueda en TMDB (Loki, What If...?).
--   marcable       FALSE en los títulos aún no estrenados: no se pueden
--                  marcar como vistos ni cuentan en el denominador.
--   cuenta_en_tiempo  FALSE en la Saga de los Defensores, que se muestra
--                  aparte («≈140 h») y no entra en las estadísticas.
--   agrupado       TRUE cuando la fila no es un título único sino un
--                  conjunto: se pinta a lo ancho y sin carátula.
CREATE TABLE titulos (
    id               INT          NOT NULL,
    tipo             VARCHAR(16)  NOT NULL,
    titulo_es        VARCHAR(160) NOT NULL,
    titulo_en        VARCHAR(160) NULL,
    anio_mostrado    VARCHAR(20)  NOT NULL,
    busqueda_tmdb    VARCHAR(160) NULL,
    media            VARCHAR(8)   NULL,
    anio_busqueda    INT          NULL,
    temporada        INT          NULL,
    bloque_id        INT          NOT NULL,
    duracion_min     INT          NULL,
    orden_estreno    INT          NOT NULL,
    opcional         BOOLEAN      NOT NULL DEFAULT FALSE,
    agrupado         BOOLEAN      NOT NULL DEFAULT FALSE,
    cuenta_en_tiempo BOOLEAN      NOT NULL DEFAULT TRUE,
    marcable         BOOLEAN      NOT NULL DEFAULT TRUE,
    nota_es          TEXT         NULL,
    nota_en          TEXT         NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_titulos_orden_estreno (orden_estreno),
    KEY ix_titulos_bloque (bloque_id),
    CONSTRAINT fk_titulos_bloque FOREIGN KEY (bloque_id) REFERENCES bloques (id),
    CONSTRAINT ck_titulos_duracion CHECK (duracion_min IS NULL OR duracion_min > 0),
    CONSTRAINT ck_titulos_orden CHECK (id > 0 AND orden_estreno > 0),
    CONSTRAINT ck_titulos_tipo CHECK (tipo IN ('pelicula', 'serie', 'corto', 'especial', 'animacion', 'proxima')),
    CONSTRAINT ck_titulos_media CHECK (media IS NULL OR media IN ('movie', 'tv'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- Secciones opcionales del final de la guía (sin check ni tiempo).
CREATE TABLE opcionales (
    id            INT          NOT NULL AUTO_INCREMENT,
    seccion_clave VARCHAR(60)  NOT NULL,
    seccion_es    VARCHAR(120) NOT NULL,
    seccion_en    VARCHAR(120) NOT NULL,
    orden_seccion INT          NOT NULL,
    orden_item    INT          NOT NULL,
    texto_es      VARCHAR(200) NOT NULL,
    texto_en      VARCHAR(200) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_opcionales_posicion (orden_seccion, orden_item)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
--  CACHÉ DE TMDB
--
--  El backend es el único que habla con TMDB. Estas tablas guardan lo que
--  devuelve, por idioma, con TTL de 30 días (`actualizado_en`).
-- =====================================================================

CREATE TABLE posters (
    titulo_id      INT          NOT NULL,
    idioma         VARCHAR(2)   NOT NULL,
    url            VARCHAR(300) NULL,
    backdrop_url   VARCHAR(300) NULL,
    actualizado_en DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (titulo_id, idioma),
    CONSTRAINT fk_posters_titulo FOREIGN KEY (titulo_id) REFERENCES titulos (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE sinopsis (
    titulo_id      INT         NOT NULL,
    idioma         VARCHAR(2)  NOT NULL,
    texto          TEXT        NULL,
    actualizado_en DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (titulo_id, idioma),
    CONSTRAINT fk_sinopsis_titulo FOREIGN KEY (titulo_id) REFERENCES titulos (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
--  CUENTAS
--
--  Minimización de datos (RGPD): solo email, hash de contraseña, dos
--  interruptores y la marca temporal de aceptación de los términos, que
--  el propio RGPD exige poder acreditar.
-- =====================================================================

CREATE TABLE usuarios (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    email              VARCHAR(254) NOT NULL,
    password_hash      VARCHAR(60)  NOT NULL,
    email_verificado   BOOLEAN      NOT NULL DEFAULT FALSE,
    twofa_activado     BOOLEAN      NOT NULL DEFAULT FALSE,
    idioma             VARCHAR(2)   NOT NULL DEFAULT 'es',
    acepto_terminos_en DATETIME(6)  NULL,
    creado_en          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_email (email),
    -- Índice para la tarea programada que borra cuentas sin verificar a
    -- los 7 días.
    KEY ix_usuarios_sin_verificar (email_verificado, creado_en)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- Códigos de un solo uso: verificación de registro, segundo factor y
-- restablecimiento de contraseña. Se guarda siempre el HASH, nunca el
-- código en claro.
CREATE TABLE codigos (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    usuario_id  BIGINT      NOT NULL,
    tipo        VARCHAR(16) NOT NULL,
    codigo_hash VARCHAR(64) NOT NULL,
    expira_en   DATETIME(6) NOT NULL,
    intentos    INT         NOT NULL DEFAULT 0,
    usado_en    DATETIME(6) NULL,
    creado_en   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY ix_codigos_usuario_tipo (usuario_id, tipo, usado_en),
    KEY ix_codigos_expira (expira_en),
    CONSTRAINT fk_codigos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT ck_codigos_tipo CHECK (tipo IN ('registro', 'dosfa', 'reset'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- Refresh tokens rotativos. También se guardan hasheados.
CREATE TABLE refresh_tokens (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    usuario_id      BIGINT      NOT NULL,
    token_hash      VARCHAR(64) NOT NULL,
    expira_en       DATETIME(6) NOT NULL,
    revocado        BOOLEAN     NOT NULL DEFAULT FALSE,
    reemplazado_por BIGINT      NULL,
    creado_en       DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_refresh_tokens_hash (token_hash),
    KEY ix_refresh_tokens_usuario (usuario_id, revocado),
    KEY ix_refresh_tokens_expira (expira_en),
    CONSTRAINT fk_refresh_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- =====================================================================
--  DATOS DE USUARIO
-- =====================================================================

CREATE TABLE progreso (
    usuario_id BIGINT      NOT NULL,
    titulo_id  INT         NOT NULL,
    visto_en   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (usuario_id, titulo_id),
    -- Para las estadísticas globales anónimas («el X % ya lo ha visto»).
    KEY ix_progreso_titulo (titulo_id),
    CONSTRAINT fk_progreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_progreso_titulo FOREIGN KEY (titulo_id) REFERENCES titulos (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE valoraciones (
    usuario_id     BIGINT      NOT NULL,
    titulo_id      INT         NOT NULL,
    valor          INT         NOT NULL,
    actualizado_en DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (usuario_id, titulo_id),
    KEY ix_valoraciones_titulo (titulo_id),
    CONSTRAINT fk_valoraciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_valoraciones_titulo FOREIGN KEY (titulo_id) REFERENCES titulos (id) ON DELETE CASCADE,
    CONSTRAINT ck_valoraciones_valor CHECK (valor BETWEEN 1 AND 5)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE notas (
    usuario_id     BIGINT       NOT NULL,
    titulo_id      INT          NOT NULL,
    texto          VARCHAR(500) NOT NULL,
    actualizado_en DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (usuario_id, titulo_id),
    CONSTRAINT fk_notas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_notas_titulo FOREIGN KEY (titulo_id) REFERENCES titulos (id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
