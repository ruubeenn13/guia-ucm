-- ─────────────────────────────────────────────────────────────────────
--  Guía UCM — datos del catálogo
--
--  Estos datos son la guía en sí. No se inventan, añaden ni reordenan
--  títulos: cualquier cambio en el catálogo va en una migración nueva.
--
--  `titulos.id` es el orden cronológico y `orden_estreno` la posición por
--  fecha de estreno (1..70, sin huecos ni repeticiones).
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO sagas (numero, nombre_es, nombre_en) VALUES
    (1, 'Saga del Infinito', 'The Infinity Saga'),
    (2, 'Saga del Multiverso', 'The Multiverse Saga');

-- Los ids van del 1 al 12 en este mismo orden: bloque_id = (saga-1)*6 + numero.
INSERT INTO bloques (id, saga, numero, nombre_es, nombre_en) VALUES
    ( 1, 1, 1, 'Los orígenes',                 'The origins'),
    ( 2, 1, 2, 'El nacimiento de los héroes',  'The birth of the heroes'),
    ( 3, 1, 3, 'Los Vengadores se reúnen',     'The Avengers assemble'),
    ( 4, 1, 4, 'La amenaza crece',             'The threat grows'),
    ( 5, 1, 5, 'Camino a la guerra',           'The road to war'),
    ( 6, 1, 6, 'La Guerra del Infinito',       'The Infinity War'),
    ( 7, 2, 1, 'Un mundo tras el Blip',        'A world after the Blip'),
    ( 8, 2, 2, 'Nuevos héroes, nuevas amenazas', 'New heroes, new threats'),
    ( 9, 2, 3, 'El multiverso se abre',        'The multiverse opens'),
    (10, 2, 4, 'El caos multiversal',          'Multiversal chaos'),
    (11, 2, 5, 'Una nueva era de héroes',      'A new era of heroes'),
    (12, 2, 6, 'Rumbo a Secret Wars',          'Heading to Secret Wars');

-- ─────────────────────────────────────────────────────────────────────
--  Títulos
--
--  `titulo_en` solo se rellena cuando no vale la regla general (usar
--  `busqueda_tmdb` sin el prefijo «Marvel One-Shot: »): temporadas
--  sueltas y la agrupación de los Defensores.
-- ─────────────────────────────────────────────────────────────────────

-- Saga del Infinito · Bloque 1 · Los orígenes
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (1, 'pelicula', 'Capitán América: El Primer Vengador', NULL, '2011', 'Captain America: The First Avenger', 'movie', 2011, NULL, 1, 124, 5),
    (2, 'corto',    'Agente Carter',                       NULL, '2013', 'Marvel One-Shot: Agent Carter',      'movie', 2013, NULL, 1,  15, 11),
    (3, 'pelicula', 'Capitana Marvel',                     NULL, '2019', 'Captain Marvel',                     'movie', 2019, NULL, 1, 123, 27);

-- Saga del Infinito · Bloque 2 · El nacimiento de los héroes
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (4, 'pelicula', 'Iron Man',                                          NULL, '2008', 'Iron Man',                                                  'movie', 2008, NULL, 2, 126, 1),
    (5, 'corto',    'El Consultor',                                      NULL, '2011', 'Marvel One-Shot: The Consultant',                           'movie', 2011, NULL, 2,   4, 6),
    (6, 'pelicula', 'Iron Man 2',                                        NULL, '2010', 'Iron Man 2',                                                'movie', 2010, NULL, 2, 124, 3),
    (7, 'pelicula', 'El Increíble Hulk',                                 NULL, '2008', 'The Incredible Hulk',                                       'movie', 2008, NULL, 2, 112, 2),
    (8, 'pelicula', 'Thor',                                              NULL, '2011', 'Thor',                                                      'movie', 2011, NULL, 2, 115, 4),
    (9, 'corto',    'Algo divertido ocurrió camino al martillo de Thor',  NULL, '2011', 'A Funny Thing Happened on the Way to Thor''s Hammer',        'movie', 2011, NULL, 2,   4, 7);

-- Saga del Infinito · Bloque 3 · Los Vengadores se reúnen
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (10, 'pelicula', 'Los Vengadores',     NULL, '2012', 'The Avengers',                     'movie', 2012, NULL, 3, 143,  8),
    (11, 'corto',    'Item 47',            NULL, '2012', 'Marvel One-Shot: Item 47',         'movie', 2012, NULL, 3,  12,  9),
    (12, 'pelicula', 'Iron Man 3',         NULL, '2013', 'Iron Man 3',                       'movie', 2013, NULL, 3, 130, 10),
    (13, 'corto',    'Larga vida al rey',  NULL, '2014', 'Marvel One-Shot: All Hail the King', 'movie', 2014, NULL, 3,  14, 13);

-- Saga del Infinito · Bloque 4 · La amenaza crece
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (14, 'pelicula',  'Thor: El Mundo Oscuro',                  NULL,                 '2013',      'Thor: The Dark World',                'movie', 2013, NULL, 4, 112, 12),
    (15, 'pelicula',  'Capitán América: El Soldado de Invierno', NULL,                 '2014',      'Captain America: The Winter Soldier', 'movie', 2014, NULL, 4, 136, 14),
    (16, 'pelicula',  'Guardianes de la Galaxia',               NULL,                 '2014',      'Guardians of the Galaxy',             'movie', 2014, NULL, 4, 121, 15),
    (17, 'pelicula',  'Guardianes de la Galaxia Vol. 2',        NULL,                 '2017',      'Guardians of the Galaxy Vol. 2',      'movie', 2017, NULL, 4, 136, 21),
    (18, 'animacion', 'I Am Groot T1 y T2',                     'I Am Groot S1 & S2', '2022–2023', 'I Am Groot',                          'tv',    2022, NULL, 4,  40, 43),
    (19, 'pelicula',  'Vengadores: La Era de Ultrón',           NULL,                 '2015',      'Avengers: Age of Ultron',             'movie', 2015, NULL, 4, 141, 16),
    (20, 'pelicula',  'Ant-Man',                                NULL,                 '2015',      'Ant-Man',                             'movie', 2015, NULL, 4, 117, 17);

-- La Saga de los Defensores es una agrupación, no un título: se pinta a lo
-- ancho, sin carátula, es opcional y queda fuera de las estadísticas de
-- tiempo (sus ≈140 h se muestran aparte).
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno,
                     opcional, agrupado, cuenta_en_tiempo, nota_es, nota_en) VALUES
    (21, 'serie', 'Saga de los Defensores', 'The Defenders Saga', '2015–2019', NULL, NULL, NULL, NULL, 4, 8400, 18,
     TRUE, TRUE, FALSE,
     'Daredevil T1–T3, Jessica Jones T1–T3, Luke Cage T1–T2, Iron Fist T1–T2, The Defenders, The Punisher T1–T2 — opcional, pero Daredevil y Punisher muy recomendadas (conectan con Ojo de Halcón, Echo y Daredevil: Born Again)',
     'Daredevil S1–S3, Jessica Jones S1–S3, Luke Cage S1–S2, Iron Fist S1–S2, The Defenders, The Punisher S1–S2 — optional, but Daredevil and The Punisher come highly recommended (they connect with Hawkeye, Echo and Daredevil: Born Again)');

-- Saga del Infinito · Bloque 5 · Camino a la guerra
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (22, 'pelicula', 'Capitán América: Civil War', NULL, '2016', 'Captain America: Civil War', 'movie', 2016, NULL, 5, 147, 19),
    (23, 'pelicula', 'Viuda Negra',                NULL, '2021', 'Black Widow',                'movie', 2021, NULL, 5, 134, 33),
    (24, 'pelicula', 'Pantera Negra',              NULL, '2018', 'Black Panther',              'movie', 2018, NULL, 5, 134, 24),
    (25, 'pelicula', 'Spider-Man: Homecoming',     NULL, '2017', 'Spider-Man: Homecoming',     'movie', 2017, NULL, 5, 133, 22),
    (26, 'pelicula', 'Doctor Strange',             NULL, '2016', 'Doctor Strange',             'movie', 2016, NULL, 5, 115, 20),
    (27, 'pelicula', 'Thor: Ragnarok',             NULL, '2017', 'Thor: Ragnarok',             'movie', 2017, NULL, 5, 130, 23),
    (28, 'pelicula', 'Ant-Man y la Avispa',        NULL, '2018', 'Ant-Man and the Wasp',       'movie', 2018, NULL, 5, 118, 26);

-- Saga del Infinito · Bloque 6 · La Guerra del Infinito
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (29, 'pelicula', 'Vengadores: Infinity War', NULL, '2018', 'Avengers: Infinity War', 'movie', 2018, NULL, 6, 149, 25),
    (30, 'pelicula', 'Vengadores: Endgame',      NULL, '2019', 'Avengers: Endgame',      'movie', 2019, NULL, 6, 181, 28);

-- Saga del Multiverso · Bloque 1 · Un mundo tras el Blip
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (31, 'serie',     'WandaVision',                       NULL,              '2021', 'WandaVision',                       'tv',    2021, NULL, 7, 350, 30),
    (32, 'serie',     'Falcon y el Soldado de Invierno',   NULL,              '2021', 'The Falcon and the Winter Soldier', 'tv',    2021, NULL, 7, 300, 31),
    (33, 'pelicula',  'Spider-Man: Lejos de casa',         NULL,              '2019', 'Spider-Man: Far From Home',         'movie', 2019, NULL, 7, 129, 29),
    (34, 'serie',     'Loki T1',                           'Loki S1',         '2021', 'Loki',                              'tv',    2021,    1, 7, 285, 32),
    (35, 'animacion', 'What If...? T1',                    'What If...? S1',  '2021', 'What If...?',                       'tv',    2021,    1, 7, 270, 34);

-- Saga del Multiverso · Bloque 2 · Nuevos héroes, nuevas amenazas
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (36, 'pelicula', 'Shang-Chi y la leyenda de los Diez Anillos', NULL, '2021', 'Shang-Chi and the Legend of the Ten Rings', 'movie', 2021, NULL, 8, 132, 35),
    (37, 'pelicula', 'Eternals',                                  NULL, '2021', 'Eternals',                                 'movie', 2021, NULL, 8, 156, 36),
    (38, 'pelicula', 'Spider-Man: No Way Home',                   NULL, '2021', 'Spider-Man: No Way Home',                  'movie', 2021, NULL, 8, 148, 38),
    (39, 'serie',    'Ojo de Halcón',                             NULL, '2021', 'Hawkeye',                                  'tv',    2021, NULL, 8, 280, 37),
    (40, 'serie',    'Caballero Luna',                            NULL, '2022', 'Moon Knight',                              'tv',    2022, NULL, 8, 280, 39);

-- Saga del Multiverso · Bloque 3 · El multiverso se abre
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (41, 'pelicula', 'Doctor Strange en el Multiverso de la Locura',        NULL, '2022', 'Doctor Strange in the Multiverse of Madness', 'movie', 2022, NULL, 9, 126, 40),
    (42, 'serie',    'Ms. Marvel',                                          NULL, '2022', 'Ms. Marvel',                                  'tv',    2022, NULL, 9, 270, 41),
    (43, 'pelicula', 'Thor: Love and Thunder',                              NULL, '2022', 'Thor: Love and Thunder',                      'movie', 2022, NULL, 9, 119, 42),
    (44, 'especial', 'Licántropo en la noche',                              NULL, '2022', 'Werewolf by Night',                           'movie', 2022, NULL, 9,  53, 45),
    (45, 'serie',    'She-Hulk: Abogada Hulka',                             NULL, '2022', 'She-Hulk: Attorney at Law',                   'tv',    2022, NULL, 9, 285, 44),
    (46, 'pelicula', 'Black Panther: Wakanda Forever',                      NULL, '2022', 'Black Panther: Wakanda Forever',              'movie', 2022, NULL, 9, 161, 46),
    (47, 'especial', 'Guardianes de la Galaxia: Especial Felices Fiestas',  NULL, '2022', 'The Guardians of the Galaxy Holiday Special', 'movie', 2022, NULL, 9,  44, 47);

-- Saga del Multiverso · Bloque 4 · El caos multiversal
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (48, 'pelicula',  'Ant-Man y la Avispa: Quantumania', NULL,             '2023', 'Ant-Man and the Wasp: Quantumania', 'movie', 2023, NULL, 10, 125, 48),
    (49, 'pelicula',  'Guardianes de la Galaxia Vol. 3',  NULL,             '2023', 'Guardians of the Galaxy Vol. 3',    'movie', 2023, NULL, 10, 150, 49),
    (50, 'serie',     'Invasión Secreta',                 NULL,             '2023', 'Secret Invasion',                   'tv',    2023, NULL, 10, 270, 50),
    (51, 'serie',     'Loki T2',                          'Loki S2',        '2023', 'Loki',                              'tv',    2021,    2, 10, 300, 51),
    (52, 'pelicula',  'The Marvels',                      NULL,             '2023', 'The Marvels',                       'movie', 2023, NULL, 10, 105, 52),
    (53, 'animacion', 'What If...? T2',                   'What If...? S2',  '2023', 'What If...?',                       'tv',    2021,    2, 10, 270, 53),
    (54, 'serie',     'Echo',                             NULL,             '2024', 'Echo',                              'tv',    2024, NULL, 10, 200, 54),
    (55, 'pelicula',  'Deadpool y Lobezno',               NULL,             '2024', 'Deadpool & Wolverine',              'movie', 2024, NULL, 10, 128, 55),
    (56, 'serie',     'Agatha, ¿quién si no?',            NULL,             '2024', 'Agatha All Along',                  'tv',    2024, NULL, 10, 315, 56),
    (57, 'animacion', 'What If...? T3',                   'What If...? S3',  '2024', 'What If...?',                       'tv',    2021,    3, 10, 240, 57);

-- Saga del Multiverso · Bloque 5 · Una nueva era de héroes
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (58, 'serie',     'Daredevil: Born Again T1',           'Daredevil: Born Again S1', '2025', 'Daredevil: Born Again',           'tv',    2025,    1, 11, 405, 59),
    (59, 'pelicula',  'Capitán América: Brave New World',   NULL,                       '2025', 'Captain America: Brave New World', 'movie', 2025, NULL, 11, 119, 58),
    (60, 'pelicula',  'Thunderbolts*',                      NULL,                       '2025', 'Thunderbolts',                     'movie', 2025, NULL, 11, 127, 60),
    (61, 'serie',     'Ironheart',                          NULL,                       '2025', 'Ironheart',                        'tv',    2025, NULL, 11, 240, 61),
    (62, 'animacion', 'Eyes of Wakanda',                    NULL,                       '2025', 'Eyes of Wakanda',                  'tv',    2025, NULL, 11, 120, 63),
    (63, 'pelicula',  'Los 4 Fantásticos: Primeros Pasos',  NULL,                       '2025', 'The Fantastic Four: First Steps',  'movie', 2025, NULL, 11, 115, 62),
    (64, 'animacion', 'Marvel Zombies',                     NULL,                       '2025', 'Marvel Zombies',                   'tv',    2025, NULL, 11, 120, 64);

-- Saga del Multiverso · Bloque 6 · Rumbo a Secret Wars
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno) VALUES
    (65, 'serie',    'Wonder Man',                NULL,                       '2026', 'Wonder Man',                'tv',    2026, NULL, 12, 240, 65),
    (66, 'serie',    'Daredevil: Born Again T2',  'Daredevil: Born Again S2', '2026', 'Daredevil: Born Again',     'tv',    2025,    2, 12, 360, 66),
    (67, 'pelicula', 'Spider-Man: Brand New Day', NULL,                       '2026', 'Spider-Man: Brand New Day', 'movie', 2026, NULL, 12, 130, 67);

-- Aún sin estrenar: no se pueden marcar como vistos y no entran en el
-- denominador del progreso (67 títulos marcables sobre 70 filas).
INSERT INTO titulos (id, tipo, titulo_es, titulo_en, anio_mostrado, busqueda_tmdb, media, anio_busqueda, temporada, bloque_id, duracion_min, orden_estreno, marcable) VALUES
    (68, 'proxima', 'Vengadores: Doomsday',    NULL, 'dic. 2026', 'Avengers: Doomsday',    'movie', 2026, NULL, 12, NULL, 68, FALSE),
    (69, 'proxima', 'VisionQuest',             NULL, '2026',      'VisionQuest',           'tv',    2026, NULL, 12, NULL, 69, FALSE),
    (70, 'proxima', 'Vengadores: Secret Wars', NULL, 'dic. 2027', 'Avengers: Secret Wars', 'movie', 2027, NULL, 12, NULL, 70, FALSE);

-- ─────────────────────────────────────────────────────────────────────
--  Secciones opcionales del final de la guía (sin check ni tiempo)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO opcionales (seccion_clave, seccion_es, seccion_en, orden_seccion, orden_item, texto_es, texto_en) VALUES
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 1, 'Agentes de S.H.I.E.L.D. (2013–2020)', 'Agents of S.H.I.E.L.D. (2013–2020)'),
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 2, 'Agente Carter serie (2015–2016)',     'Agent Carter series (2015–2016)'),
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 3, 'Inhumans (2017)',                     'Inhumans (2017)'),
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 4, 'Runaways (2017–2019)',                'Runaways (2017–2019)'),
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 5, 'Cloak & Dagger (2018–2019)',          'Cloak & Dagger (2018–2019)'),
    ('legado_tv', 'Legado Marvel TV', 'Marvel TV legacy', 1, 6, 'Helstrom (2020)',                     'Helstrom (2020)');

INSERT INTO opcionales (seccion_clave, seccion_es, seccion_en, orden_seccion, orden_item, texto_es, texto_en) VALUES
    ('animacion_otros', 'Animación de otros universos', 'Animation from other universes', 2, 1, 'X-Men ''97 (2024)',                             'X-Men ''97 (2024)'),
    ('animacion_otros', 'Animación de otros universos', 'Animation from other universes', 2, 2, 'Your Friendly Neighborhood Spider-Man (2025)',  'Your Friendly Neighborhood Spider-Man (2025)'),
    ('animacion_otros', 'Animación de otros universos', 'Animation from other universes', 2, 3, 'Spider-Man: Un nuevo universo (2018)',          'Spider-Man: Into the Spider-Verse (2018)'),
    ('animacion_otros', 'Animación de otros universos', 'Animation from other universes', 2, 4, 'Spider-Man: A través del Spider-Verso (2023)',  'Spider-Man: Across the Spider-Verse (2023)');

INSERT INTO opcionales (seccion_clave, seccion_es, seccion_en, orden_seccion, orden_item, texto_es, texto_en) VALUES
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 1, 'Spider-Man 1–3 de Raimi (2002–2007)',  'Raimi''s Spider-Man 1–3 (2002–2007)'),
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 2, 'The Amazing Spider-Man 1–2 (2012–2014)', 'The Amazing Spider-Man 1–2 (2012–2014)'),
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 3, 'Venom 1–3 (2018–2024)',                'Venom 1–3 (2018–2024)'),
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 4, 'Morbius (2022)',                       'Morbius (2022)'),
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 5, 'Madame Web (2024)',                    'Madame Web (2024)'),
    ('sony', 'Universo Sony', 'Sony''s universe', 3, 6, 'Kraven the Hunter (2024)',             'Kraven the Hunter (2024)');

INSERT INTO opcionales (seccion_clave, seccion_es, seccion_en, orden_seccion, orden_item, texto_es, texto_en) VALUES
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  1, 'X-Men (2000)',                            'X-Men (2000)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  2, 'X-Men 2 (2003)',                          'X2 (2003)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  3, 'X-Men: La decisión final (2006)',         'X-Men: The Last Stand (2006)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  4, 'X-Men Orígenes: Lobezno (2009)',          'X-Men Origins: Wolverine (2009)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  5, 'X-Men: Primera generación (2011)',        'X-Men: First Class (2011)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  6, 'Lobezno inmortal (2013)',                 'The Wolverine (2013)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  7, 'X-Men: Días del futuro pasado (2014)',    'X-Men: Days of Future Past (2014)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  8, 'X-Men: Apocalipsis (2016)',               'X-Men: Apocalypse (2016)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4,  9, 'X-Men: Fénix Oscura (2019)',              'Dark Phoenix (2019)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4, 10, 'Los Nuevos Mutantes (2020)',              'The New Mutants (2020)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4, 11, 'Logan (2017)',                            'Logan (2017)'),
    ('fox_xmen', 'Universo X-Men de Fox', 'Fox''s X-Men universe', 4, 12, 'Deadpool 1–2 (2016–2018)',                'Deadpool 1–2 (2016–2018)');

INSERT INTO opcionales (seccion_clave, seccion_es, seccion_en, orden_seccion, orden_item, texto_es, texto_en) VALUES
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  1, 'Blade 1–3 (1998–2004)',                          'Blade 1–3 (1998–2004)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  2, 'Hulk (2003)',                                    'Hulk (2003)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  3, 'Daredevil (2003)',                               'Daredevil (2003)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  4, 'Elektra (2005)',                                 'Elektra (2005)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  5, 'El Castigador (2004)',                           'The Punisher (2004)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  6, 'Punisher: War Zone (2008)',                      'Punisher: War Zone (2008)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  7, 'Ghost Rider (2007)',                             'Ghost Rider (2007)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  8, 'Ghost Rider: Espíritu de venganza (2011)',       'Ghost Rider: Spirit of Vengeance (2011)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5,  9, 'Los 4 Fantásticos (2005)',                       'Fantastic Four (2005)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5, 10, 'Los 4 Fantásticos y Silver Surfer (2007)',       'Fantastic Four: Rise of the Silver Surfer (2007)'),
    ('clasicos', 'Clásicos Marvel pre-UCM', 'Pre-MCU Marvel classics', 5, 11, 'Cuatro Fantásticos (2015)',                      'Fantastic Four (2015)');
