package dev.rubenlav.guiaucm.catalogo.dominio;

import dev.rubenlav.guiaucm.comun.Idioma;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Una de las dos sagas en las que se divide la guía. */
@Entity
@Table(name = "sagas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Saga {

    /** 1 = Saga del Infinito, 2 = Saga del Multiverso. */
    @Id
    @Column(name = "numero")
    private Integer numero;

    @Column(name = "nombre_es", nullable = false)
    private String nombreEs;

    @Column(name = "nombre_en", nullable = false)
    private String nombreEn;

    /**
     * @param idioma idioma pedido en la petición
     * @return el nombre de la saga en ese idioma
     */
    public String nombre(Idioma idioma) {
        return idioma == Idioma.EN ? nombreEn : nombreEs;
    }
}
