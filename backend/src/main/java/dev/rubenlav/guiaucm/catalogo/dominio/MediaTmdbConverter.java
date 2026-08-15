package dev.rubenlav.guiaucm.catalogo.dominio;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/** Convierte {@link MediaTmdb} a la cadena exacta del ENUM de MySQL. */
@Converter(autoApply = true)
public class MediaTmdbConverter implements AttributeConverter<MediaTmdb, String> {

    @Override
    public String convertToDatabaseColumn(MediaTmdb media) {
        return media == null ? null : media.clave();
    }

    @Override
    public MediaTmdb convertToEntityAttribute(String clave) {
        return clave == null ? null : MediaTmdb.desdeClave(clave);
    }
}
