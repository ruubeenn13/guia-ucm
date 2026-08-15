package dev.rubenlav.guiaucm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS restringido al único origen del frontend.
 *
 * <p>En producción, frontend y API se sirven bajo el mismo dominio a través
 * de Nginx, así que las peticiones ni siquiera son de origen cruzado. Esta
 * configuración existe sobre todo para el desarrollo local, donde Vite
 * escucha en otro puerto.
 */
@Configuration
public class ConfiguracionCors implements WebMvcConfigurer {

    private final PropiedadesGuiaUcm propiedades;

    public ConfiguracionCors(PropiedadesGuiaUcm propiedades) {
        this.propiedades = propiedades;
    }

    @Override
    public void addCorsMappings(CorsRegistry registro) {
        registro.addMapping("/api/**")
                .allowedOrigins(propiedades.corsOrigin())
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept-Language")
                // Necesario para la cookie httpOnly del refresh token.
                .allowCredentials(true)
                .maxAge(3600);
    }
}
