package dev.rubenlav.guiaucm.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuración propia de la aplicación, con prefijo {@code guia-ucm}.
 *
 * @param corsOrigin origen exacto del frontend autorizado a llamar a la API.
 *                   Nunca se usa un comodín: si el valor falta, la aplicación
 *                   no arranca.
 */
@Validated
@ConfigurationProperties(prefix = "guia-ucm")
public record PropiedadesGuiaUcm(@NotBlank String corsOrigin) {
}
