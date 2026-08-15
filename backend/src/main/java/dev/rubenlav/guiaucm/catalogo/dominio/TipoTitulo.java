package dev.rubenlav.guiaucm.catalogo.dominio;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

/**
 * Tipo de contenido de un título. Cada tipo tiene su color propio en la
 * interfaz.
 *
 * <p>{@code PROXIMA} identifica los títulos aún sin estrenar: no se pueden
 * marcar como vistos y no entran en el denominador del progreso.
 */
public enum TipoTitulo {

    PELICULA("pelicula"),
    SERIE("serie"),
    CORTO("corto"),
    ESPECIAL("especial"),
    ANIMACION("animacion"),
    PROXIMA("proxima");

    private final String clave;

    TipoTitulo(String clave) {
        this.clave = clave;
    }

    /** Valor tal y como se guarda en la base de datos y se sirve en la API. */
    @JsonValue
    public String clave() {
        return clave;
    }

    public static TipoTitulo desdeClave(String clave) {
        return Arrays.stream(values())
                .filter(tipo -> tipo.clave.equals(clave))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de título desconocido: " + clave));
    }
}
