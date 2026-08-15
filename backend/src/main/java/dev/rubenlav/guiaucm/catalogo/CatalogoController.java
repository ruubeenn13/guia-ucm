package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dto.CatalogoDto;
import dev.rubenlav.guiaucm.comun.Idioma;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

/** Catálogo de la guía. Es público: no hace falta cuenta para consultarlo. */
@RestController
@RequestMapping("/api/v1/titulos")
@Tag(name = "Catálogo", description = "Sagas, bloques, títulos y secciones opcionales")
public class CatalogoController {

    private final CatalogoService servicio;

    public CatalogoController(CatalogoService servicio) {
        this.servicio = servicio;
    }

    /**
     * Devuelve el catálogo completo.
     *
     * @param idioma código de idioma («es» o «en»); si falta, español
     * @return las 70 filas de la guía con sus bloques y secciones opcionales
     */
    @GetMapping
    @Operation(summary = "Catálogo completo",
            description = """
                    Devuelve las 70 filas de la guía agrupadas por saga y bloque, en orden
                    cronológico, junto con las secciones opcionales del final.

                    No se pagina: el tamaño es fijo y no depende de quien llama, y partirlo
                    obligaría al cliente a encadenar peticiones para pintar la primera pantalla.
                    """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catálogo devuelto"),
            @ApiResponse(responseCode = "400", description = "Idioma no soportado", content = @io.swagger.v3.oas.annotations.media.Content)
    })
    public ResponseEntity<CatalogoDto> obtenerCatalogo(
            @Parameter(description = "Idioma de los textos", example = "es")
            @RequestParam(name = "idioma", defaultValue = "es") String idioma) {

        CatalogoDto catalogo = servicio.obtenerCatalogo(Idioma.desde(idioma));

        // El catálogo solo cambia cuando se despliega una migración nueva, así
        // que se puede cachear con tranquilidad en el navegador y en Nginx.
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic())
                .body(catalogo);
    }
}
