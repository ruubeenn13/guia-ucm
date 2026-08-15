package dev.rubenlav.guiaucm.comun;

/**
 * Recurso inexistente.
 *
 * <p>Se traduce en un 404 con un mensaje genérico. Nunca se incluye el
 * identificador ni ningún dato que permita sondear qué existe y qué no.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
