package dev.rubenlav.guiaucm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

/**
 * Punto de entrada de la API de Guía UCM.
 *
 * <p>Toda la aplicación trabaja en UTC: las fechas se guardan y se sirven en
 * UTC y es el navegador quien las pasa a la hora local del usuario.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class GuiaUcmApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(GuiaUcmApplication.class, args);
    }
}
