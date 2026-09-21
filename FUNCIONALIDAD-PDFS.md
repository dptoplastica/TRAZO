# Funcionalidad de Ejercicios en PDF

## Descripción

Se ha añadido la funcionalidad de adjuntar archivos PDF a cada actividad dentro de las Situaciones de Aprendizaje. Esto permite a los profesores incluir ejercicios, fichas, materiales complementarios y recursos didácticos directamente asociados a cada actividad.

## Características

### Para cada actividad puedes:

1. **Añadir PDFs**: Botón "Añadir ejercicio PDF" que permite seleccionar archivos PDF desde tu ordenador
2. **Ver PDFs**: Icono de ojo (👁️) para abrir el PDF en una nueva pestaña del navegador
3. **Descargar PDFs**: Icono de descarga (⬇️) para guardar el PDF en tu ordenador
4. **Eliminar PDFs**: Icono de X (✖️) para quitar un PDF de la actividad

### Información mostrada para cada PDF:

- **Nombre del archivo**: Nombre original del PDF
- **Tamaño**: Tamaño del archivo en KB
- **Icono**: Icono de documento PDF en color rojo

## Cómo usar

### Añadir un PDF a una actividad:

1. Ve a **Situaciones de Aprendizaje** en el menú lateral
2. Selecciona una situación de aprendizaje existente o crea una nueva
3. En la sección **Secuencia de actividades**, busca la actividad donde quieres añadir el PDF
4. Haz clic en el botón **"Añadir ejercicio PDF"** (aparece debajo de cada actividad)
5. Selecciona el archivo PDF desde tu ordenador
6. El PDF se cargará automáticamente y aparecerá listado debajo de la actividad

### Gestionar los PDFs:

Una vez cargados los PDFs, puedes:

- **Ver**: Haz clic en el icono 👁️ para abrir el PDF en el navegador
- **Descargar**: Haz clic en el icono ⬇️ para descargar el PDF
- **Eliminar**: Haz clic en el icono ✖️ para eliminar el PDF de la actividad

## Casos de uso

### Ejemplos de uso en el aula:

1. **Fichas de ejercicios**: Adjuntar fichas de práctica para cada actividad
2. **Enunciados de problemas**: Incluir problemas de geometría, tangencias, etc.
3. **Material complementario**: Añadir lecturas, artículos o recursos adicionales
4. **Rúbricas de evaluación**: Adjuntar rúbricas para evaluar la actividad
5. **Ejemplos resueltos**: Incluir ejemplos de soluciones para referencia del alumnado
6. **Planos y dibujos técnicos**: Adjuntar planos normalizados o dibujos técnicos

### Ejemplo práctico para Dibujo Técnico I:

En la situación de aprendizaje **"Geometría que construye"** (CE2), puedes:

- Actividad 1 (Lugares geométricos): Adjuntar ficha con ejercicios de mediatrices y bisectrices
- Actividad 2 (Proporcionalidad): Adjuntar problemas de tercera y cuarta proporcional
- Actividad 5 (Polígonos regulares): Adjuntar ficha con métodos de trazado
- Actividad 7 (Tangencias básicas): Adjuntar problemas de enlace recta-circunferencia
- Examen 1: Adjuntar el enunciado del examen en PDF

## Aspectos técnicos

### Almacenamiento:

- Los PDFs se almacenan en **base64** dentro del localStorage del navegador
- Cada PDF incluye: nombre, datos codificados, tamaño y fecha de adición
- Los PDFs se guardan junto con la situación de aprendizaje

### Limitaciones:

- **Tamaño recomendado**: Menos de 5 MB por PDF para un rendimiento óptimo
- **Espacio total**: El localStorage tiene un límite de 5-10 MB dependiendo del navegador
- **Solo PDF**: El sistema solo acepta archivos con extensión `.pdf`

### Recomendaciones:

- Comprime los PDFs antes de subirlos si son muy grandes
- Usa nombres descriptivos para los archivos (ej: "Ficha_Tangencias_Basicas.pdf")
- Considera usar enlaces externos para materiales muy pesados

## Exportación e informes

Cuando exportes la programación didáctica o generes informes:

- Los PDFs adjuntos **NO se incluyen automáticamente** en la exportación
- Para incluir los materiales, debes exportarlos manualmente desde cada actividad
- En futuras versiones se podrá incluir un anexo con todos los materiales

## Próximas mejoras

Funcionalidades planificadas para futuras versiones:

- [ ] Vista previa del PDF sin descargar
- [ ] Organización de PDFs por categorías (ejercicios, teoría, ejemplos)
- [ ] Enlace de PDFs a criterios de evaluación específicos
- [ ] Exportación masiva de todos los PDFs de una situación de aprendizaje
- [ ] Sincronización con servicios en la nube (Google Drive, Dropbox)
- [ ] Compartir PDFs entre diferentes situaciones de aprendizaje

## Soporte

Si encuentras problemas con la funcionalidad:

1. Verifica que el archivo sea realmente un PDF
2. Comprueba que el tamaño no sea excesivo (< 5 MB recomendado)
3. Si el PDF no se visualiza correctamente, prueba a descargarlo y abrirlo con un visor PDF
4. Para problemas persistentes, contacta con el administrador del sistema

---

**Versión**: 1.0  
**Fecha**: Septiembre 2026  
**Autor**: Departamento de Dibujo - IES Lope de Vega
