package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dto.BloqueDto;
import dev.rubenlav.guiaucm.catalogo.dto.CatalogoDto;
import dev.rubenlav.guiaucm.catalogo.dto.SagaDto;
import dev.rubenlav.guiaucm.catalogo.dto.TituloDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprueba de punta a punta que las migraciones, el seed, el mapeo JPA y el
 * endpoint del catálogo encajan.
 *
 * <p>Levanta un MySQL 8.4 con Testcontainers: nunca se toca la base de datos
 * real ni una de desarrollo compartida.
 */
@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CatalogoIT {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
            .withDatabaseName("guia_ucm");

    @Autowired
    private TestRestTemplate rest;

    @Test
    @DisplayName("El seed carga las 70 filas de la guía repartidas en 2 sagas y 12 bloques")
    void elSeedCargaLaGuiaEntera() {
        CatalogoDto catalogo = pedirCatalogo("es");

        assertThat(catalogo.sagas()).hasSize(2);
        assertThat(catalogo.sagas().stream().mapToInt(saga -> saga.bloques().size()).sum()).isEqualTo(12);
        assertThat(todosLosTitulos(catalogo)).hasSize(70);
    }

    @Test
    @DisplayName("El denominador del progreso son los 67 títulos ya estrenados")
    void elDenominadorSonSesentaYSiete() {
        CatalogoDto catalogo = pedirCatalogo("es");

        assertThat(catalogo.totalMarcables()).isEqualTo(67);
        assertThat(todosLosTitulos(catalogo).stream().filter(titulo -> !titulo.marcable()))
                .hasSize(3)
                .allMatch(titulo -> titulo.duracionMin() == null);
    }

    @Test
    @DisplayName("La Saga de los Defensores va aparte: opcional, agrupada y fuera del tiempo")
    void laSagaDeLosDefensoresVaAparte() {
        CatalogoDto catalogo = pedirCatalogo("es");

        TituloDto defensores = todosLosTitulos(catalogo).stream()
                .filter(titulo -> titulo.id() == 21)
                .findFirst()
                .orElseThrow();

        assertThat(defensores.opcional()).isTrue();
        assertThat(defensores.agrupado()).isTrue();
        assertThat(defensores.cuentaEnTiempo()).isFalse();
        assertThat(defensores.duracionMin()).isEqualTo(8400);
        assertThat(defensores.nota()).contains("Daredevil T1–T3");

        // 8400 minutos = 140 horas, que la interfaz muestra por separado.
        assertThat(catalogo.tiempoOpcionalMin()).isEqualTo(8400);
        assertThat(catalogo.tiempoTotalMin()).isPositive();
    }

    @Test
    @DisplayName("El orden de estreno cubre del 1 al 70 sin huecos ni repeticiones")
    void elOrdenDeEstrenoEstaCompleto() {
        List<Integer> ordenes = todosLosTitulos(pedirCatalogo("es")).stream()
                .map(TituloDto::ordenEstreno)
                .sorted()
                .toList();

        assertThat(ordenes).hasSize(70);
        assertThat(ordenes).isEqualTo(java.util.stream.IntStream.rangeClosed(1, 70).boxed().toList());
    }

    @Test
    @DisplayName("En inglés se usa el título original, sin el prefijo de los One-Shots")
    void enInglesSeUsaElTituloOriginal() {
        List<TituloDto> titulos = todosLosTitulos(pedirCatalogo("en"));

        assertThat(tituloConId(titulos, 2).titulo()).isEqualTo("Agent Carter");
        assertThat(tituloConId(titulos, 51).titulo()).isEqualTo("Loki S2");
        assertThat(tituloConId(titulos, 1).titulo()).isEqualTo("Captain America: The First Avenger");
    }

    @Test
    @DisplayName("Un idioma no soportado devuelve 400, no un error interno")
    void idiomaNoSoportadoDevuelve400() {
        ResponseEntity<String> respuesta = rest.getForEntity("/api/v1/titulos?idioma=fr", String.class);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(respuesta.getBody()).doesNotContain("Exception");
    }

    private CatalogoDto pedirCatalogo(String idioma) {
        ResponseEntity<CatalogoDto> respuesta =
                rest.getForEntity("/api/v1/titulos?idioma=" + idioma, CatalogoDto.class);

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.OK);
        return respuesta.getBody();
    }

    private List<TituloDto> todosLosTitulos(CatalogoDto catalogo) {
        return catalogo.sagas().stream()
                .map(SagaDto::bloques)
                .flatMap(List::stream)
                .map(BloqueDto::titulos)
                .flatMap(List::stream)
                .toList();
    }

    private TituloDto tituloConId(List<TituloDto> titulos, int id) {
        return titulos.stream().filter(titulo -> titulo.id() == id).findFirst().orElseThrow();
    }
}
