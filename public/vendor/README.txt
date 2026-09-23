pdfmake.min.js y pdfmake-helvetica.js NO son código propio ni se instalan
por npm: son la build oficial "para navegador" de la librería pdfmake
(https://www.npmjs.com/package/pdfmake), copiada tal cual desde
node_modules/pdfmake/build/ (pdfmake.min.js y
build/standard-fonts/Helvetica.js).

Se cargan como <script> normal en tiempo de ejecución (ver
downloadReportPdf en MiInformeTab.jsx) en vez de importarse con
`import`, porque esa build está pensada para usarse como script
global — al intentar empaquetarla con Vite/Rollup el bundler la
partía en pedazos de forma inestable.

Para actualizar la versión: `npm install pdfmake@ultima`, copiar de
nuevo esos dos archivos desde node_modules/pdfmake/build/, y volver a
`npm uninstall pdfmake` (no hace falta como dependencia, solo se usó
para obtener los archivos).
