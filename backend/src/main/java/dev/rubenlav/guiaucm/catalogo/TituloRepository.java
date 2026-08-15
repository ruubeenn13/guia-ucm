package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dominio.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TituloRepository extends JpaRepository<Titulo, Integer> {

    /**
     * Todos los títulos en orden cronológico, con su bloque y su saga ya
     * cargados. Una sola consulta: el catálogo se pinta entero de golpe y no
     * tiene sentido pagarlo en N+1 selects.
     *
     * @return los 70 títulos ordenados por su número de orden cronológico
     */
    @Query("""
            SELECT t FROM Titulo t
            JOIN FETCH t.bloque b
            JOIN FETCH b.saga s
            ORDER BY t.id ASC
            """)
    List<Titulo> buscarCatalogoCompleto();

    /**
     * @return número de títulos ya estrenados, que es el denominador del
     *         progreso que ve el usuario
     */
    long countByMarcableTrue();
}
