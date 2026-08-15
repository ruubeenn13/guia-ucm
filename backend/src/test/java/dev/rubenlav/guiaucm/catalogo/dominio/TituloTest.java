package dev.rubenlav.guiaucm.catalogo.dominio;

import dev.rubenlav.guiaucm.comun.Idioma;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Reglas de localización del título. No tocan la base de datos, así que van
 * como test unitario.
 */
class TituloTest {

    @Test
    @DisplayName("En español devuelve el título en español tal cual")
    void enEspanolDevuelveElTituloEspanol() {
        Titulo titulo = titulo("Capitana Marvel", null, "Captain Marvel");

        assertThat(titulo.titulo(Idioma.ES)).isEqualTo("Capitana Marvel");
    }

    @Test
    @DisplayName("En inglés usa el título original de la búsqueda de TMDB")
    void enInglesUsaLaBusquedaDeTmdb() {
        Titulo titulo = titulo("Capitana Marvel", null, "Captain Marvel");

        assertThat(titulo.titulo(Idioma.EN)).isEqualTo("Captain Marvel");
    }

    @Test
    @DisplayName("En inglés quita el prefijo «Marvel One-Shot: » de los cortos")
    void enInglesQuitaElPrefijoDeLosCortos() {
        Titulo titulo = titulo("Agente Carter", null, "Marvel One-Shot: Agent Carter");

        assertThat(titulo.titulo(Idioma.EN)).isEqualTo("Agent Carter");
    }

    @Test
    @DisplayName("El título en inglés explícito manda sobre la búsqueda de TMDB")
    void elTituloInglesExplicitoManda() {
        Titulo titulo = titulo("Loki T2", "Loki S2", "Loki");

        assertThat(titulo.titulo(Idioma.EN)).isEqualTo("Loki S2");
    }

    @Test
    @DisplayName("Sin búsqueda de TMDB ni título inglés cae al español")
    void sinDatosCaeAlEspanol() {
        Titulo titulo = titulo("Saga de los Defensores", null, null);

        assertThat(titulo.titulo(Idioma.EN)).isEqualTo("Saga de los Defensores");
    }

    private Titulo titulo(String tituloEs, String tituloEn, String busquedaTmdb) {
        Titulo titulo = new Titulo();
        titulo.setTituloEs(tituloEs);
        titulo.setTituloEn(tituloEn);
        titulo.setBusquedaTmdb(busquedaTmdb);
        return titulo;
    }
}
