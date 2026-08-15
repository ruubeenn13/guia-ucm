package dev.rubenlav.guiaucm.catalogo.dominio;

import dev.rubenlav.guiaucm.comun.Idioma;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Una entrada de las secciones opcionales del final de la guía.
 *
 * <p>No se marcan como vistas ni suman tiempo: son solo referencias para
 * quien quiera seguir tirando del hilo.
 */
@Entity
@Table(name = "opcionales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Opcional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /** Identificador estable de la sección, útil como clave de traducción. */
    @Column(name = "seccion_clave", nullable = false)
    private String seccionClave;

    @Column(name = "seccion_es", nullable = false)
    private String seccionEs;

    @Column(name = "seccion_en", nullable = false)
    private String seccionEn;

    @Column(name = "orden_seccion", nullable = false)
    private Integer ordenSeccion;

    @Column(name = "orden_item", nullable = false)
    private Integer ordenItem;

    @Column(name = "texto_es", nullable = false)
    private String textoEs;

    @Column(name = "texto_en", nullable = false)
    private String textoEn;

    public String seccion(Idioma idioma) {
        return idioma == Idioma.EN ? seccionEn : seccionEs;
    }

    public String texto(Idioma idioma) {
        return idioma == Idioma.EN ? textoEn : textoEs;
    }
}
