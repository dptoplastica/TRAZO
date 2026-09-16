# TRAZO - Sistema de Programación Didáctica LOMLOE

## 🎯 Sistema de Login

La aplicación ahora usa un **sistema de login local** que funciona sin necesidad de conexión a Supabase.

### Credenciales de acceso

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Jefatura de Departamento** | carmen.prieto@educantabria.es | Trazo2025! |
| **Profesora** | laura.gomez@educantabria.es | Trazo2025! |
| **Profesor** | miguel.ruiz@educantabria.es | Trazo2025! |

## 🚀 Cómo usar

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abrir el navegador:**
   ```
   http://localhost:3000
   ```

3. **Iniciar sesión** con cualquiera de las credenciales anteriores

4. **Cerrar sesión:**
   - Haz clic en el botón "Salir" en la esquina superior derecha

## 📊 Datos de demostración

La aplicación incluye datos de demostración completos:

- **Centro:** IES Lope de Vega (Santa María de Cayón, Cantabria)
- **Curso académico:** 2025-26
- **5 grupos:** 4º ESO A, 1º Bach A, 1º Bach B, 1º Bach C, 2º Bach B
- **6 asignaturas:** EPVA, Expresión Artística, Dibujo Técnico I y II, Taller de Podcast, Audiovisual
- **31 alumnos** con calificaciones, asistencia y observaciones
- **12 situaciones de aprendizaje** completas
- **31 instrumentos de evaluación**
- **Calificaciones generadas automáticamente**

## 💾 Persistencia de datos

Todos los datos se guardan en el **localStorage** del navegador:
- ✅ No requiere servidor backend
- ✅ Funciona completamente offline
- ✅ Los cambios se mantienen entre sesiones
- ✅ Cada navegador tiene sus propios datos

### Limpiar datos

Para restaurar los datos de demostración originales:

1. Abre la consola del navegador (F12)
2. Ejecuta:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

## 🔧 Características

### Para profesorado:
- ✅ Programaciones didácticas completas
- ✅ Situaciones de aprendizaje
- ✅ Cuaderno del profesor digital
- ✅ Sistema de evaluación con rúbricas
- ✅ Informes individuales y de grupo
- ✅ Atención a la diversidad
- ✅ Planes de recuperación

### Para jefatura de departamento:
- ✅ Gestión de profesorado
- ✅ Gestión de materias y optativas
- ✅ Gestión de grupos y alumnos
- ✅ Supervisión de todas las programaciones
- ✅ Exportación de documentación

## 📚 Currículos LOMLOE incluidos

- Educación Plástica, Visual y Audiovisual (ESO)
- Expresión Artística (1º Bachillerato)
- Dibujo Técnico I (1º Bachillerato) - **Actualizado con criterios oficiales**
- Dibujo Técnico II (2º Bachillerato)
- Taller de Podcast (1º Bachillerato) - Optativa de centro

## 🔄 Futuras mejoras

- [ ] Integración con Supabase para sincronización multi-dispositivo
- [ ] Exportación a PDF mejorada
- [ ] Importación de alumnos desde CSV/Excel
- [ ] Sincronización con plataformas educativas (Alexia, Séneca)

## 📝 Notas técnicas

- **Framework:** React 18 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Build tool:** Vite
- **Almacenamiento:** localStorage
- **Autenticación:** Sistema local (sin backend)

---

**Desarrollado para el IES Lope de Vega - Santa María de Cayón, Cantabria**
