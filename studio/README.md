# Electa by Dröma — v0.4 (edición operativa local)

Abre `index.html` en un navegador moderno o sube todos los archivos de esta carpeta a una ruta de tu servidor web. Mantén los archivos juntos. No requiere compilación ni base de datos.

## Funciones disponibles
- Doce módulos de gráficos electorales, formatos 16:9, 1:1 y 9:16, personalización y exportación SVG, PNG, CSV, JSON y HTML autónomo.
- Editor de partidos, porcentajes, escaños, encuestas, comparativas, coaliciones y cronología.
- Importación de CSV y cartografía GeoJSON. Los mapas importados se muestran en gris hasta que se asigna explícitamente un partido ganador por territorio.
- Panel de validación básica de cifras, origen de los datos, fuente y advertencias antes de exportar.
- Guardado automático local y recuperación voluntaria de sesión, copia JSON portable y guardado manual.
- Banda de pie de gráfico separada del contenido.

## Limitaciones importantes
- No hay conexión automática con organismos electorales, API en directo, servidor, usuarios, permisos, auditoría ni colaboración. Los gráficos exportados y los iframes son estáticos.
- El selector «datos importados» NO verifica que una fuente sea oficial; el usuario debe comprobarla.
- El control de exportación es una advertencia, no una protección editorial o de seguridad.
- Los datos iniciales son ficticios. Las cifras no deben publicarse como resultados reales sin verificarlas.
- El mapa utiliza una proyección simplificada para GeoJSON; no es un GIS de precisión. El HTML autónomo es una instantánea.
- El autoguardado usa localStorage del navegador y puede borrarse. Conserva copias JSON externas.

## CSV
Cabeceras `nombre;porcentaje;escanos;color`. Para cartografía importa GeoJSON FeatureCollection con polígonos y asigna ganadores en el módulo Mapas.

## Integración en Dröma
Sube la carpeta a `/electa/` o la ruta deseada. La aplicación funciona como sitio estático y puede integrarse con iframe. Para trabajo multiusuario, resultados en vivo y publicación sincronizada se requiere backend y autenticación.
