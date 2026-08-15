package dev.rubenlav.guiaucm.comun;

/**
 * Entrada rechazada por no cumplir las reglas de negocio.
 *
 * <p>Se traduce en un 400 con un mensaje que puede verse: no debe contener
 * nunca detalles internos ni confirmar la existencia de un recurso.
 */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
