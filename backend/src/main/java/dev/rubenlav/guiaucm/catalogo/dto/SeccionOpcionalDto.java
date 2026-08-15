package dev.rubenlav.guiaucm.catalogo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Sección de contenido opcional del final de la guía.
 *
 * @param clave  identificador estable de la sección
 * @param nombre nombre de la sección en el idioma pedido
 * @param items  entradas de la sección, en orden
 */
@Schema(description = "Sección de contenido opcional")
public record SeccionOpcionalDto(String clave, String nombre, List<String> items) {
}
