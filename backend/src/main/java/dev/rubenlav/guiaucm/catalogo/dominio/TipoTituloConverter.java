package dev.rubenlav.guiaucm.catalogo.dominio;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Convierte {@link TipoTitulo} a la cadena exacta del ENUM de MySQL.
 *
 * <p>No se usa {@code @Enumerated(STRING)} a propósito: dependería de que el
 * nombre de la constante Java coincidiera literalmente con el valor de la
 * columna, y renombrar la constante rompería los datos en silencio.
 */
@Converter(autoApply = true)
public class TipoTituloConverter implements AttributeConverter<TipoTitulo, String> {

    @Override
    public String convertToDatabaseColumn(TipoTitulo tipo) {
        return tipo == null ? null : tipo.clave();
    }

    @Override
    public TipoTitulo convertToEntityAttribute(String clave) {
        return clave == null ? null : TipoTitulo.desdeClave(clave);
    }
}
