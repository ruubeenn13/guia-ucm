package dev.rubenlav.guiaucm.catalogo.dominio;

import dev.rubenlav.guiaucm.comun.Idioma;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un título de la guía.
 *
 * <p>El identificador es el número de orden cronológico, que es también la
 * clave con la que el resto de tablas (progreso, valoraciones, notas, caché
 * de TMDB) se refieren a él.
 */
@Entity
@Table(name = "titulos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Titulo {

    /** Número de orden cronológico. */
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "tipo", nullable = false)
    private TipoTitulo tipo;

    @Column(name = "titulo_es", nullable = false)
    private String tituloEs;

    /**
     * Título en inglés. Solo se rellena cuando no sirve la regla general
     * (derivarlo de {@link #busquedaTmdb}): temporadas sueltas y filas
     * agrupadas.
     */
    @Column(name = "titulo_en")
    private String tituloEn;

    /** Año o rango de años tal cual se muestra («2011», «2015–2019», «dic. 2026»). */
    @Column(name = "anio_mostrado", nullable = false)
    private String anioMostrado;

    /** Texto exacto con el que se busca el título en TMDB. */
    @Column(name = "busqueda_tmdb")
    private String busquedaTmdb;

    @Column(name = "media")
    private MediaTmdb media;

    /** Año que se pasa a TMDB para desambiguar la búsqueda. */
    @Column(name = "anio_busqueda")
    private Integer anioBusqueda;

    /** Temporada concreta, cuando varias filas comparten la misma serie. */
    @Column(name = "temporada")
    private Integer temporada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bloque_id", nullable = false)
    private Bloque bloque;

    /** Duración aproximada en minutos. {@code null} en los títulos sin estrenar. */
    @Column(name = "duracion_min")
    private Integer duracionMin;

    @Column(name = "orden_estreno", nullable = false)
    private Integer ordenEstreno;

    /** Se puede saltar sin perderse la historia principal. */
    @Column(name = "opcional", nullable = false)
    private boolean opcional;

    /** La fila representa un conjunto de series, no un título único. */
    @Column(name = "agrupado", nullable = false)
    private boolean agrupado;

    /** Suma en las estadísticas de tiempo. */
    @Column(name = "cuenta_en_tiempo", nullable = false)
    private boolean cuentaEnTiempo;

    /** Ya estrenado, luego se puede marcar como visto. */
    @Column(name = "marcable", nullable = false)
    private boolean marcable;

    @Column(name = "nota_es")
    private String notaEs;

    @Column(name = "nota_en")
    private String notaEn;

    /**
     * Título en el idioma pedido.
     *
     * <p>En inglés se usa el título original, que es el mismo texto con el que
     * se busca en TMDB, quitando el prefijo «Marvel One-Shot: » de los cortos.
     * Si hay un valor explícito en {@code titulo_en}, manda ese.
     */
    public String titulo(Idioma idioma) {
        if (idioma != Idioma.EN) {
            return tituloEs;
        }
        if (tituloEn != null && !tituloEn.isBlank()) {
            return tituloEn;
        }
        if (busquedaTmdb == null || busquedaTmdb.isBlank()) {
            return tituloEs;
        }
        return busquedaTmdb.startsWith(PREFIJO_ONE_SHOT)
                ? busquedaTmdb.substring(PREFIJO_ONE_SHOT.length())
                : busquedaTmdb;
    }

    public String nota(Idioma idioma) {
        return idioma == Idioma.EN ? notaEn : notaEs;
    }

    private static final String PREFIJO_ONE_SHOT = "Marvel One-Shot: ";
}
