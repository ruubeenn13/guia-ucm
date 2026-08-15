package dev.rubenlav.guiaucm.comun;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Traduce cualquier excepción a una respuesta uniforme en formato
 * {@code application/problem+json} (RFC 9457).
 *
 * <p>Hereda de {@link ResponseEntityExceptionHandler} para quedarse también
 * con los errores propios de Spring MVC (ruta inexistente, método no
 * permitido, cuerpo ilegible…) y que no acaben en el manejador genérico
 * disfrazados de error 500.
 *
 * <p>Dos reglas que no se rompen:
 * <ol>
 *   <li>El cuerpo de la respuesta jamás revela detalles internos: ni trazas,
 *       ni consultas, ni si un recurso o una cuenta existen.</li>
 *   <li>Los errores inesperados se registran completos en el log del
 *       servidor, pero al cliente solo le llega un mensaje genérico.</li>
 * </ol>
 */
@RestControllerAdvice
public class ManejadorGlobalExcepciones extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ManejadorGlobalExcepciones.class);
    private static final URI TIPO_VALIDACION = URI.create("https://ucm.rubenlav.dev/errores/validacion");

    @ExceptionHandler(SolicitudInvalidaException.class)
    public ProblemDetail solicitudInvalida(SolicitudInvalidaException ex) {
        return construir(HttpStatus.BAD_REQUEST, "Solicitud incorrecta", ex.getMessage());
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ProblemDetail noEncontrado(RecursoNoEncontradoException ex) {
        return construir(HttpStatus.NOT_FOUND, "No encontrado", ex.getMessage());
    }

    /**
     * Red de seguridad. Cualquier excepción no contemplada acaba aquí: se
     * registra con su traza y el cliente solo recibe un 500 genérico.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail errorInesperado(Exception ex, HttpServletRequest peticion) {
        log.error("Error inesperado atendiendo {} {}", peticion.getMethod(), peticion.getRequestURI(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno",
                "Algo ha fallado por nuestra parte. Inténtalo de nuevo en unos minutos.");
    }

    /** Fallos de Bean Validation: se devuelve qué campo falla, nunca por qué internamente. */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders cabeceras,
                                                                  HttpStatusCode estado,
                                                                  WebRequest peticion) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(error.getField(), error.getDefaultMessage()));

        ProblemDetail problema = construir(HttpStatus.BAD_REQUEST, "Datos no válidos",
                "Revisa los campos marcados.");
        problema.setType(TIPO_VALIDACION);
        problema.setProperty("errores", errores);
        return ResponseEntity.badRequest().body(problema);
    }

    /**
     * Los errores propios de Spring MVC se registran a nivel de aviso, sin
     * traza: son ruido de clientes mal formados, no fallos del servidor.
     */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex,
                                                             @Nullable Object cuerpo,
                                                             HttpHeaders cabeceras,
                                                             HttpStatusCode estado,
                                                             WebRequest peticion) {
        if (estado.is5xxServerError()) {
            log.error("Error de Spring MVC: {}", ex.getMessage(), ex);
        } else {
            log.warn("Petición rechazada ({}): {}", estado.value(), ex.getMessage());
        }
        return super.handleExceptionInternal(ex, cuerpo, cabeceras, estado, peticion);
    }

    private ProblemDetail construir(HttpStatus estado, String titulo, String detalle) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(estado, detalle);
        problema.setTitle(titulo);
        return problema;
    }
}
