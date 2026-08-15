package dev.rubenlav.guiaucm.catalogo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Saga con sus bloques.
 *
 * @param numero  1 (Saga del Infinito) o 2 (Saga del Multiverso)
 * @param nombre  nombre de la saga en el idioma pedido
 * @param bloques bloques de la saga, en orden
 */
@Schema(description = "Saga de la guía")
public record SagaDto(Integer numero, String nombre, List<BloqueDto> bloques) {
}
