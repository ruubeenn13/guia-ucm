package dev.rubenlav.guiaucm.catalogo.dominio;

import dev.rubenlav.guiaucm.comun.Idioma;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Bloque temático dentro de una saga.
 *
 * <p>{@code numero} es la posición del bloque dentro de su saga (1..6), no un
 * identificador global.
 */
@Entity
@Table(name = "bloques")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bloque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "saga", referencedColumnName = "numero", nullable = false)
    private Saga saga;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "nombre_es", nullable = false)
    private String nombreEs;

    @Column(name = "nombre_en", nullable = false)
    private String nombreEn;

    public String nombre(Idioma idioma) {
        return idioma == Idioma.EN ? nombreEn : nombreEs;
    }
}
