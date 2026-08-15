package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dominio.Bloque;
import dev.rubenlav.guiaucm.catalogo.dominio.Opcional;
import dev.rubenlav.guiaucm.catalogo.dominio.Saga;
import dev.rubenlav.guiaucm.catalogo.dominio.Titulo;
import dev.rubenlav.guiaucm.catalogo.dto.BloqueDto;
import dev.rubenlav.guiaucm.catalogo.dto.CatalogoDto;
import dev.rubenlav.guiaucm.catalogo.dto.SagaDto;
import dev.rubenlav.guiaucm.catalogo.dto.SeccionOpcionalDto;
import dev.rubenlav.guiaucm.comun.Idioma;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Arma el catálogo completo: sagas, bloques, títulos y secciones opcionales,
 * todo resuelto al idioma de la petición.
 */
@Service
public class CatalogoService {

    private final TituloRepository tituloRepository;
    private final OpcionalRepository opcionalRepository;
    private final CatalogoMapper mapper;

    public CatalogoService(TituloRepository tituloRepository,
                           OpcionalRepository opcionalRepository,
                           CatalogoMapper mapper) {
        this.tituloRepository = tituloRepository;
        this.opcionalRepository = opcionalRepository;
        this.mapper = mapper;
    }

    /**
     * @param idioma idioma en el que resolver los textos
     * @return el catálogo entero, listo para pintar sin más peticiones
     */
    @Transactional(readOnly = true)
    public CatalogoDto obtenerCatalogo(Idioma idioma) {
        List<Titulo> titulos = tituloRepository.buscarCatalogoCompleto();

        return new CatalogoDto(
                idioma.clave(),
                (int) titulos.stream().filter(Titulo::isMarcable).count(),
                sumarMinutos(titulos, true),
                sumarMinutos(titulos, false),
                agruparEnSagas(titulos, idioma),
                agruparOpcionales(idioma));
    }

    /**
     * Suma la duración de los títulos ya estrenados.
     *
     * @param cuentanEnTiempo {@code true} para el tiempo que entra en las
     *                        estadísticas, {@code false} para el que se
     *                        muestra aparte (la Saga de los Defensores)
     */
    private int sumarMinutos(List<Titulo> titulos, boolean cuentanEnTiempo) {
        return titulos.stream()
                .filter(Titulo::isMarcable)
                .filter(titulo -> titulo.isCuentaEnTiempo() == cuentanEnTiempo)
                .filter(titulo -> titulo.getDuracionMin() != null)
                .mapToInt(Titulo::getDuracionMin)
                .sum();
    }

    /** Reparte los títulos en su saga y su bloque, respetando el orden de cada nivel. */
    private List<SagaDto> agruparEnSagas(List<Titulo> titulos, Idioma idioma) {
        Map<Integer, Saga> sagas = new LinkedHashMap<>();
        Map<Integer, Map<Integer, List<Titulo>>> porSagaYBloque = new LinkedHashMap<>();
        Map<Integer, Bloque> bloques = new LinkedHashMap<>();

        for (Titulo titulo : titulos) {
            Bloque bloque = titulo.getBloque();
            Saga saga = bloque.getSaga();
            sagas.putIfAbsent(saga.getNumero(), saga);
            bloques.putIfAbsent(bloque.getId(), bloque);
            porSagaYBloque
                    .computeIfAbsent(saga.getNumero(), clave -> new LinkedHashMap<>())
                    .computeIfAbsent(bloque.getId(), clave -> new ArrayList<>())
                    .add(titulo);
        }

        List<SagaDto> resultado = new ArrayList<>();
        sagas.values().stream()
                .sorted(Comparator.comparing(Saga::getNumero))
                .forEach(saga -> {
                    List<BloqueDto> bloquesDto = porSagaYBloque.get(saga.getNumero()).entrySet().stream()
                            .sorted(Comparator.comparing(entrada -> bloques.get(entrada.getKey()).getNumero()))
                            .map(entrada -> {
                                Bloque bloque = bloques.get(entrada.getKey());
                                List<Titulo> delBloque = entrada.getValue().stream()
                                        .sorted(Comparator.comparing(Titulo::getId))
                                        .toList();
                                return new BloqueDto(bloque.getNumero(), bloque.nombre(idioma),
                                        mapper.aDtos(delBloque, idioma));
                            })
                            .toList();
                    resultado.add(new SagaDto(saga.getNumero(), saga.nombre(idioma), bloquesDto));
                });
        return resultado;
    }

    /** Agrupa las entradas opcionales por sección, manteniendo el orden del seed. */
    private List<SeccionOpcionalDto> agruparOpcionales(Idioma idioma) {
        Map<String, List<Opcional>> porSeccion = new LinkedHashMap<>();
        for (Opcional opcional : opcionalRepository.findAllByOrderByOrdenSeccionAscOrdenItemAsc()) {
            porSeccion.computeIfAbsent(opcional.getSeccionClave(), clave -> new ArrayList<>()).add(opcional);
        }

        return porSeccion.entrySet().stream()
                .map(entrada -> new SeccionOpcionalDto(
                        entrada.getKey(),
                        entrada.getValue().getFirst().seccion(idioma),
                        entrada.getValue().stream().map(opcional -> opcional.texto(idioma)).toList()))
                .toList();
    }
}
