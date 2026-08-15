package dev.rubenlav.guiaucm.catalogo.dto;

import dev.rubenlav.guiaucm.catalogo.dominio.TipoTitulo;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Un título tal y como lo consume el frontend, ya resuelto al idioma pedido.
 *
 * @param id             número de orden cronológico
 * @param tipo           tipo de contenido, que determina su color
 * @param titulo         título en el idioma de la petición
 * @param anio           año o rango de años de estreno, ya formateado
 * @param duracionMin    duración aproximada en minutos, {@code null} si aún no se ha estrenado
 * @param ordenEstreno   posición en el orden por fecha de estreno
 * @param temporada      temporada concreta, cuando la serie está partida en varias entradas
 * @param opcional       se puede saltar sin perderse la historia principal
 * @param agrupado       la fila representa un conjunto de series, no un título único
 * @param cuentaEnTiempo suma en las estadísticas de tiempo
 * @param marcable       ya estrenado, luego se puede marcar como visto
 * @param nota           aclaración que se muestra bajo el título, si la hay
 */
@Schema(description = "Título de la guía")
public record TituloDto(
        Integer id,
        TipoTitulo tipo,
        String titulo,
        String anio,
        Integer duracionMin,
        Integer ordenEstreno,
        Integer temporada,
        boolean opcional,
        boolean agrupado,
        boolean cuentaEnTiempo,
        boolean marcable,
        String nota) {
}
