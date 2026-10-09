# 📤📥 Exportar e Importar Situaciones de Aprendizaje

## ✅ Funcionalidad Implementada

He añadido la capacidad de **exportar e importar Situaciones de Aprendizaje (SdA)** mediante archivos JSON. Esta funcionalidad permite:

- 📤 **Exportar** todas las SdA de una programación a un archivo JSON
- 📥 **Importar** SdA desde un archivo JSON previamente exportado
- 🔄 **Compartir** SdA entre profesores
- 💾 **Hacer backup** de tus SdA
- 📋 **Reutilizar** SdA en diferentes cursos o asignaturas

---

## 🎯 Cómo Usar la Funcionalidad

### **📤 Exportar SdA**

1. **Ve a la vista de Situaciones de Aprendizaje**
2. **Haz clic en el botón "Exportar"** (arriba a la derecha)
3. **Selecciona la programación** de la cual quieres exportar las SdA
4. **Haz clic en "Exportar JSON"**
5. **Se descargará un archivo** con el nombre: `sdas-[asignatura]-[fecha].json`

**Ejemplo de archivo exportado:**
```json
{
  "version": "1.0",
  "exportDate": "2026-01-15T10:30:00.000Z",
  "programacionId": "p4",
  "programacionNombre": "Programación de Dibujo Técnico I",
  "asignatura": "Dibujo Técnico I",
  "situaciones": [
    {
      "id": "sa28",
      "programacionId": "p4",
      "titulo": "Fundamentos del dibujo técnico",
      "eva": 1,
      "inicio": "2025-09-15",
      "fin": "2025-10-15",
      "sesiones": 12,
      "justificacion": "...",
      "reto": "...",
      "producto": "...",
      "metodologias": [...],
      "actividades": [...],
      ...
    }
  ]
}
```

---

### **📥 Importar SdA**

1. **Ve a la vista de Situaciones de Aprendizaje**
2. **Haz clic en el botón "Importar"** (arriba a la derecha)
3. **Selecciona el archivo JSON** que quieres importar
4. **Confirma la importación** en el diálogo que aparece
5. **Las SdA se añadirán** a las existentes

**⚠️ Importante:**
- Las SdA importadas se **añaden** a las existentes (no las reemplazan)
- Se validará que el archivo tenga el formato correcto
- Se mostrará un mensaje de confirmación con el número de SdA importadas

---

## 🔍 Formato del Archivo JSON

### **Estructura Requerida:**

```json
{
  "version": "1.0",
  "exportDate": "2026-01-15T10:30:00.000Z",
  "programacionId": "p4",
  "programacionNombre": "Nombre de la programación",
  "asignatura": "Nombre de la asignatura",
  "situaciones": [
    {
      "id": "sa28",
      "programacionId": "p4",
      "titulo": "Título de la SdA",
      "eva": 1,
      "inicio": "2025-09-15",
      "fin": "2025-10-15",
      "sesiones": 12,
      "justificacion": "Justificación de la SdA",
      "reto": "Reto o pregunta guía",
      "producto": "Producto final esperado",
      "metodologias": ["Metodología 1", "Metodología 2"],
      "agrupamientos": "Tipo de agrupamiento",
      "espacios": "Espacios necesarios",
      "recursos": "Recursos necesarios",
      "diversidad": "Atención a la diversidad",
      "evidencias": "Evidencias de aprendizaje",
      "criterios": ["dt1.2.1", "dt1.2.2"],
      "objetivos": ["Objetivo 1", "Objetivo 2"],
      "actividades": [
        {
          "id": "sa28a1",
          "titulo": "Título de la actividad",
          "desc": "Descripción de la actividad",
          "fase": "Inicio",
          "sesion": 2,
          "criterioIds": ["dt1.2.1"]
        }
      ],
      "instrumentos": ["i60", "i61"]
    }
  ]
}
```

### **Campos Obligatorios:**

Cada situación de aprendizaje debe tener como mínimo:
- ✅ `titulo`
- ✅ `programacionId`
- ✅ `eva` (1, 2 o 3)
- ✅ `inicio` (formato: YYYY-MM-DD)
- ✅ `fin` (formato: YYYY-MM-DD)

---

## 💡 Casos de Uso

### **1. Compartir SdA entre Profesores**

**Escenario:** Un profesor de Dibujo Técnico quiere compartir sus SdA con otro profesor.

**Pasos:**
1. El profesor A exporta las SdA de su programación
2. Envía el archivo JSON al profesor B (email, USB, etc.)
3. El profesor B importa el archivo JSON
4. Las SdA se añaden a su programación

### **2. Backup de SdA**

**Escenario:** Quieres hacer una copia de seguridad de tus SdA antes de hacer cambios importantes.

**Pasos:**
1. Exporta las SdA de tu programación
2. Guarda el archivo JSON en un lugar seguro
3. Si algo sale mal, puedes importar el backup

### **3. Reutilizar SdA en Diferentes Cursos**

**Escenario:** Tienes una SdA que funcionó muy bien y quieres usarla en otro curso.

**Pasos:**
1. Exporta la SdA del curso original
2. Edita el JSON si necesitas cambiar el `programacionId`
3. Importa la SdA en el nuevo curso

### **4. Crear Biblioteca de SdA**

**Escenario:** Quieres crear una biblioteca de SdA reutilizables.

**Pasos:**
1. Exporta las SdA que quieras compartir
2. Organiza los archivos JSON por asignatura/tema
3. Importa las SdA según las necesites

---

## 🔧 Características Técnicas

### **Validaciones:**

- ✅ Verifica que el archivo sea un JSON válido
- ✅ Verifica que tenga la estructura correcta (campo `version` y `situaciones`)
- ✅ Verifica que cada SdA tenga los campos obligatorios
- ✅ Muestra mensajes de error claros si hay problemas

### **Seguridad:**

- ✅ Solo se permiten archivos `.json`
- ✅ Se valida el contenido antes de importar
- ✅ Se pide confirmación antes de importar
- ✅ No se sobrescriben datos existentes

### **Compatibilidad:**

- ✅ Los archivos JSON son legibles y editables
- ✅ Se pueden abrir con cualquier editor de texto
- ✅ Se pueden modificar manualmente si es necesario
- ✅ Formato estándar y documentado

---

## 🎨 Interfaz de Usuario

### **Botones en la Cabecera:**

```
┌─────────────────────────────────────────────────────────┐
│ Situaciones de aprendizaje                              │
│                                                         │
│ [📤 Exportar]  [📥 Importar]  [➕ Nueva situación]     │
└─────────────────────────────────────────────────────────┘
```

### **Modal de Exportación:**

```
┌─────────────────────────────────────────────────────────┐
│ Exportar Situaciones de Aprendizaje                    │
├─────────────────────────────────────────────────────────┤
│ Exporta todas las situaciones de aprendizaje de una    │
│ programación a un archivo JSON.                        │
│                                                         │
│ Programación: [Dibujo Técnico I (8 SdA) ▼]            │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Se exportarán 8 situaciones de aprendizaje      │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│              [Cancelar]  [📤 Exportar JSON]            │
└─────────────────────────────────────────────────────────┘
```

### **Modal de Importación:**

```
┌─────────────────────────────────────────────────────────┐
│ Importar Situaciones de Aprendizaje                    │
├─────────────────────────────────────────────────────────┤
│ Importa situaciones de aprendizaje desde un archivo    │
│ JSON previamente exportado.                            │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ⚠️ Las situaciones importadas se añadirán a    │   │
│ │    las existentes                               │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Archivo JSON: [Seleccionar archivo...]                 │
│                                                         │
│              [Cancelar]                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### **Problema: "Formato de archivo inválido"**

**Causa:** El archivo JSON no tiene la estructura correcta.

**Solución:**
1. Verifica que el archivo fue exportado desde TRAZO
2. Abre el archivo con un editor de texto y verifica la estructura
3. Asegúrate de que tiene los campos `version` y `situaciones`

### **Problema: "Alguna situación de aprendizaje tiene datos incompletos"**

**Causa:** Falta algún campo obligatorio en una SdA.

**Solución:**
1. Abre el archivo JSON con un editor de texto
2. Verifica que cada SdA tiene: `titulo`, `programacionId`, `eva`, `inicio`, `fin`
3. Completa los campos faltantes

### **Problema: "Error al leer el archivo JSON"**

**Causa:** El archivo está corrupto o no es un JSON válido.

**Solución:**
1. Verifica que el archivo tiene extensión `.json`
2. Abre el archivo con un editor de texto
3. Verifica que el contenido sea JSON válido (puedes usar https://jsonlint.com/)

---

## 📝 Archivos Modificados

- ✅ `src/views/Situaciones.tsx` - Añadida funcionalidad de exportar/importar
- ✅ `src/components/ui.tsx` - Añadido icono "upload"

---

## 🚀 Próximos Pasos

1. **Recarga la aplicación** con `Ctrl + Shift + R`
2. **Ve a Situaciones de Aprendizaje**
3. **Prueba la exportación:**
   - Haz clic en "Exportar"
   - Selecciona una programación
   - Descarga el archivo JSON
4. **Prueba la importación:**
   - Haz clic en "Importar"
   - Selecciona el archivo JSON que acabas de descargar
   - Confirma la importación

---

## 💾 Ejemplo Práctico

### **Exportar SdA de Dibujo Técnico I:**

1. Ve a Situaciones de Aprendizaje
2. Haz clic en "Exportar"
3. Selecciona "Dibujo Técnico I (8 SdA)"
4. Haz clic en "Exportar JSON"
5. Se descargará: `sdas-dibujo-tecnico-i-2026-01-15.json`

### **Importar SdA en Otra Programación:**

1. Ve a Situaciones de Aprendizaje
2. Haz clic en "Importar"
3. Selecciona el archivo `sdas-dibujo-tecnico-i-2026-01-15.json`
4. Confirma la importación
5. Las 8 SdA se añadirán a tu programación actual

---

## 🎉 ¡Listo para Usar!

La funcionalidad de exportar e importar SdA está completamente implementada y lista para usar. Recarga la aplicación y prueba las nuevas funciones.

**Documentación completa disponible en:** `EXPORTAR_IMPORTAR_SDA.md`
