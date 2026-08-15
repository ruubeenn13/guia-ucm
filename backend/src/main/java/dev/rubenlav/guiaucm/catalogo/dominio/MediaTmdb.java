package dev.rubenlav.guiaucm.catalogo.dominio;

import java.util.Arrays;

/**
 * Colección de TMDB en la que hay que buscar un título: película o serie.
 *
 * <p>Es {@code null} en las filas agrupadas, que no se corresponden con una
 * ficha concreta de TMDB.
 */
public enum MediaTmdb {

    MOVIE("movie"),
    TV("tv");

    private final String clave;

    MediaTmdb(String clave) {
        this.clave = clave;
    }

    public String clave() {
        return clave;
    }

    public static MediaTmdb desdeClave(String clave) {
        return Arrays.stream(values())
                .filter(media -> media.clave.equals(clave))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Media de TMDB desconocida: " + clave));
    }
}
