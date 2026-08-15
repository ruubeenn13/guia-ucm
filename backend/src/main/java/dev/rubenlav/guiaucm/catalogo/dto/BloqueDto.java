package dev.rubenlav.guiaucm.catalogo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Bloque temático con sus títulos en orden cronológico.
 *
 * @param numero  posición del bloque dentro de su saga
 * @param nombre  nombre del bloque en el idioma pedido
 * @param titulos títulos del bloque, ordenados cronológicamente
 */
@Schema(description = "Bloque temático de una saga")
public record BloqueDto(Integer numero, String nombre, List<TituloDto> titulos) {
}
