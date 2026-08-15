package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dominio.Opcional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpcionalRepository extends JpaRepository<Opcional, Integer> {

    /** @return las entradas opcionales en el orden en que deben mostrarse */
    List<Opcional> findAllByOrderByOrdenSeccionAscOrdenItemAsc();
}
