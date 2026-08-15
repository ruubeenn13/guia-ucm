package dev.rubenlav.guiaucm.catalogo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Catálogo completo de la guía en un único documento.
 *
 * <p>Son 70 filas fijas: no se pagina porque el tamaño no depende de nada que
 * controle quien llama, y partirlo obligaría al cliente a encadenar
 * peticiones para poder pintar la primera pantalla.
 *
 * @param idioma            idioma en el que vienen resueltos los textos
 * @param totalMarcables    títulos que se pueden marcar como vistos, es decir,
 *                          el denominador del progreso
 * @param tiempoTotalMin    minutos que suma todo lo marcable que cuenta en las
 *                          estadísticas de tiempo
 * @param tiempoOpcionalMin minutos del contenido marcable que queda fuera de
 *                          las estadísticas y se muestra aparte
 * @param sagas             sagas con sus bloques y títulos, en orden cronológico
 * @param opcionales        secciones opcionales del final de la guía
 */
@Schema(description = "Catálogo completo de la guía")
public record CatalogoDto(
        String idioma,
        int totalMarcables,
        int tiempoTotalMin,
        int tiempoOpcionalMin,
        List<SagaDto> sagas,
        List<SeccionOpcionalDto> opcionales) {
}
