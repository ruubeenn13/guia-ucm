package dev.rubenlav.guiaucm.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metadatos de la documentación OpenAPI.
 *
 * <p>Swagger UI y {@code /v3/api-docs} solo se publican con el perfil
 * {@code dev} (ver {@code application-prod.yml}): en producción quedan
 * apagados para no regalar el mapa de la API.
 */
@Configuration
public class ConfiguracionOpenApi {

    @Bean
    public OpenAPI openApiGuiaUcm() {
        return new OpenAPI().info(new Info()
                .title("Guía UCM · API")
                .version("v1")
                .description("""
                        API de la guía cronológica del Universo Cinematográfico de Marvel.

                        Sirve el catálogo, el progreso de visionado, las valoraciones y las
                        carátulas y sinopsis cacheadas de TMDB. Todas las rutas cuelgan de
                        `/api/v1`.
                        """)
                .contact(new Contact().name("Rubén Lavado").url("https://rubenlav.dev"))
                .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")));
    }
}
