# Política de seguridad

## Versiones con soporte

Solo se da soporte a la última versión publicada en la rama `main`.

| Versión | Soporte |
| ------- | ------- |
| `main`  | ✅      |
| Otras   | ❌      |

## Cómo reportar una vulnerabilidad

**No abras una incidencia pública** para reportar un fallo de seguridad.

Usa una de estas dos vías:

1. **GitHub Security Advisories** (preferida): pestaña *Security* → *Report a
   vulnerability*. Queda privado hasta que exista un parche.
2. **Correo**: `seguridad@rubenlav.dev`.

Incluye, si puedes: descripción del fallo, pasos para reproducirlo, impacto
estimado y versión o commit afectado.

## Qué puedes esperar

- **Acuse de recibo** en un plazo de 72 horas.
- **Evaluación inicial** (confirmado / no reproducible / fuera de alcance) en
  un plazo de 7 días naturales.
- **Corrección** de los fallos confirmados de severidad alta o crítica lo antes
  posible, y publicación de un aviso una vez desplegado el parche.
- Reconocimiento público en el aviso, si lo deseas.

## Alcance

Entra dentro del alcance todo lo que vive en este repositorio y el despliegue
en `ucm.rubenlav.dev`: autenticación, gestión de sesión, control de acceso a
los datos de progreso, inyección, XSS, exposición de secretos y configuración
insegura de contenedores o cabeceras.

Queda **fuera de alcance**:

- Vulnerabilidades en servicios de terceros (TMDB, Brevo, Cloudflare).
- Ataques de denegación de servicio por volumen.
- Ingeniería social o acceso físico.
- Informes generados por escáneres automáticos sin impacto demostrado.

## Pruebas de seguridad

Se agradecen las pruebas responsables contra el despliegue público, siempre
que **no degraden el servicio ni accedan a datos de otras personas**. Crea tu
propia cuenta para probar los flujos de autenticación.
