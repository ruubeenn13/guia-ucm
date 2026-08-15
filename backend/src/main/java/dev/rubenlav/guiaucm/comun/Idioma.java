package dev.rubenlav.guiaucm.comun;

import java.util.Locale;

/**
 * Idiomas soportados por la API.
 *
 * <p>Añadir uno nuevo consiste en sumar una constante aquí y su columna o
 * fila de traducción; el resto del código no distingue entre idiomas.
 */
public enum Idioma {

    ES("es", "es-ES"),
    EN("en", "en-US");

    private final String clave;
    private final String etiquetaTmdb;

    Idioma(String clave, String etiquetaTmdb) {
        this.clave = clave;
        this.etiquetaTmdb = etiquetaTmdb;
    }

    /** Código de dos letras usado en la API y en la base de datos. */
    public String clave() {
        return clave;
    }

    /** Valor del parámetro {@code language} en las llamadas a TMDB. */
    public String etiquetaTmdb() {
        return etiquetaTmdb;
    }

    /**
     * Traduce el valor recibido en la petición.
     *
     * @param valor código de idioma, sin distinguir mayúsculas
     * @return el idioma correspondiente
     * @throws SolicitudInvalidaException si el idioma no está soportado
     */
    public static Idioma desde(String valor) {
        if (valor == null || valor.isBlank()) {
            return ES;
        }
        for (Idioma idioma : values()) {
            if (idioma.clave.equals(valor.toLowerCase(Locale.ROOT))) {
                return idioma;
            }
        }
        throw new SolicitudInvalidaException("Idioma no soportado.");
    }
}
