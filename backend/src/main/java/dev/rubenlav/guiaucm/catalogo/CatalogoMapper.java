package dev.rubenlav.guiaucm.catalogo;

import dev.rubenlav.guiaucm.catalogo.dominio.Titulo;
import dev.rubenlav.guiaucm.catalogo.dto.TituloDto;
import dev.rubenlav.guiaucm.comun.Idioma;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Convierte entidades del catálogo en DTOs, resolviendo de paso los textos al
 * idioma de la petición.
 */
@Mapper(componentModel = "spring")
public interface CatalogoMapper {

    @Mapping(target = "titulo", expression = "java(entidad.titulo(idioma))")
    @Mapping(target = "anio", source = "anioMostrado")
    @Mapping(target = "nota", expression = "java(entidad.nota(idioma))")
    TituloDto aDto(Titulo entidad, @Context Idioma idioma);

    List<TituloDto> aDtos(List<Titulo> entidades, @Context Idioma idioma);
}
