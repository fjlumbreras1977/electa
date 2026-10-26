# Electa by Dröma · 1.1

Estudio electoral para periodistas y piezas interactivas para lectores.

## Instalar el módulo en Dröma

1. Descomprime el ZIP y sube la carpeta `electa` a una ruta de tu hosting, por ejemplo `/electa/`.
2. Abre esa dirección. No necesita compilación, base de datos ni instalación de paquetes.
3. Entra en **Datos electorales**. Sustituye los partidos y cifras de demostración; indica la fuente, el territorio y la fecha.
4. Selecciona una herramienta en **Mesa de trabajo** y prueba sus opciones. La vista de móvil muestra el comportamiento de la pieza en un espacio reducido.
5. Pulsa **Insertar en mi web** y descarga el HTML interactivo.
6. Sube ese HTML a una dirección pública de Dröma. Introduce esa dirección en el diálogo y copia el iframe en tu artículo o página.

El editor usa borradores locales. Si necesitas restringir el acceso al editor, aplica el acceso de usuarios de tu hosting o Dröma a la carpeta del editor y publica los HTML destinados a lectores en una carpeta pública independiente. No contiene autenticación propia.

## Herramientas para el lector

- Resultados: gráfico o tabla, orden por voto, escaños o nombre.
- Hemiciclo: un punto por escaño; selección y resaltado de formaciones.
- Pactos: combinaciones para mayoría absoluta y simulaciones de síes, noes y abstenciones para mayoría simple.
- Comparativa: escaños actuales, anteriores y variación; tabla completa desplegable.
- Participación: porcentaje actual, abstención y comparación con la cifra anterior introducida.

Las interacciones del lector se mantienen en su página y no modifican los datos del periodista. No se recogen datos de visitantes ni se envían sus combinaciones a ningún servidor.

## Actualizar una pieza publicada

El HTML descargado contiene una copia de los datos de ese momento. Cambia las cifras en el editor, exporta de nuevo la misma herramienta y reemplaza el HTML publicado manteniendo su nombre y dirección. El iframe seguirá apuntando a él. Los lectores verán los nuevos datos al cargar la pieza; no existe actualización automática en páginas que ya estén abiertas. Comprueba o desactiva la caché del alojamiento para las piezas que actualices durante una cobertura.

## Guardar y transferir proyectos

El autoguardado usa el almacenamiento local del navegador. Descarga un proyecto JSON para conservar una copia o continuar en otro equipo. La aplicación no dispone de cuentas, servidor de datos, sincronización, auditoría ni edición colaborativa.

## CSV

Columnas admitidas: `nombre;votos;porcentaje;escanos;anteriores;color`.
`nombre` y `escanos` son obligatorias. Usa enteros no negativos para votos y escaños y colores hexadecimales como `#7fa692`. Se admiten separadores coma o punto y coma y campos entrecomillados. Con punto y coma puedes usar coma decimal en el porcentaje. La importación sustituye la lista de partidos tras confirmarlo. Actualiza por separado los parámetros de cámara, fuente y fecha.

Los porcentajes se introducen manualmente. **Calcular % desde votos** usa como denominador la suma de votos de las candidaturas introducidas; añade otras candidaturas si necesitas representarlas o conserva tus porcentajes si la fuente usa otra base.

## Validación y alcance

Se bloquea la exportación de datos incoherentes, negativos, no finitos o con escaños superiores al tamaño de la cámara. Un reparto incompleto se señala como provisional. La mayoría simple compara síes y noes y excluye abstenciones; no presupone una regla legal de investidura, ni quorum ni viabilidad política. El periodista debe comprobar las reglas de cada procedimiento.

Todos los datos iniciales y ejemplos son ficticios y están identificados como simulación. Introducir el nombre de un organismo no verifica el carácter oficial de los datos.

Los archivos `ejemplos/` son piezas autónomas de demostración. No requieren recursos externos. La tipografía del editor puede descargarse de Google Fonts, con Arial como alternativa; el HTML autónomo utiliza tipografías locales y no carga fuentes externas.

## Estudio gráfico avanzado

La carpeta `studio/` conserva Electa v0.5 y sus funciones previas para gráficos, mapas GeoJSON importados, sondeos y redes sociales. Usa su propio formato de proyecto y guardado. Sus exportaciones son gráficas estáticas; para piezas interactivas utiliza las cinco herramientas del nuevo módulo principal. Los datos de ambos editores son independientes.


## Correcciones de la versión 1.1

- Se conservan los campos vacíos de un borrador al recargar; ya no se sustituyen por ceros, cifras de demostración o la fecha actual.
- Las fechas, los enteros y las importaciones incompletas se validan antes de exportar. Los porcentajes calculados desde votos suman exactamente el 100 %.
- El tema y la herramienta elegidos forman parte del proyecto portable. El guardado pendiente se completa al abandonar la página.
- Las fuentes y los nombres largos se distribuyen correctamente en el SVG. Se mantiene el texto completo de cada candidatura en su información accesible.
- Los avisos de publicación son visibles dentro de su ventana; se ofrece un enlace de descarga si el navegador no inicia automáticamente la descarga.
- El estudio avanzado conserva los roles de los partidos al eliminar candidaturas, sincroniza sus controles de pactos y valida geometrías de hasta 250.000 coordenadas sin usar llamadas con argumentos masivos.
- Se evita duplicar las capas avanzadas y se bloquea la exportación de cifras inválidas. Cancelar el restablecimiento mantiene la procedencia de los datos.

Los CSV que no incluyan porcentaje pero sí votos calculan el porcentaje sobre los votos de las candidaturas importadas. Una celda numérica vacía dentro de una columna presente se considera un dato pendiente y debe completarse. El editor principal admite hasta 100 candidaturas; el estudio gráfico avanzado conserva su límite de 40. No se recortan listas importadas silenciosamente.
