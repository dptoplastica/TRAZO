# TRAZO - Sistema de Programación Didáctica LOMLOE

## 🎯 Descripción

TRAZO es una aplicación web completa para la gestión de programación didáctica según la LOMLOE, diseñada específicamente para el Departamento de Dibujo del IES Lope de Vega.

## ✨ Características Principales

### 📚 Gestión Curricular
- **Programaciones Didácticas**: Gestión completa de programaciones por asignatura
- **Situaciones de Aprendizaje**: Diseño y seguimiento de SA con actividades detalladas
- **Unidades Didácticas**: Organización temporal del curso
- **Criterios de Evaluación**: Vinculación con el currículo LOMLOE

### 👥 Gestión de Alumnado
- **Grupos**: Creación y gestión de grupos de alumnos
- **Alumnos**: Registro completo con datos personales y académicos
- **NEAE**: Seguimiento de necesidades específicas de apoyo educativo
- **Importación CSV**: Carga masiva de alumnos desde archivos CSV

### 📊 Evaluación
- **Instrumentos**: Rúbricas, escalas, listas de cotejo, pruebas
- **Calificaciones**: Registro por criterio y actividad
- **Asistencia**: Control diario de asistencia
- **Observaciones**: Registro de observaciones del profesorado

### 📈 Informes
- **Informes Individuales**: Informes detallados por alumno
- **Informes de Grupo**: Estadísticas globales del grupo
- **Exportación PDF**: Generación de informes imprimibles
- **Competencias Clave**: Seguimiento de las 8 competencias clave

### 🎨 Atención a la Diversidad
- **Medidas**: Registro de medidas ordinarias y específicas
- **Adaptaciones**: Seguimiento de adaptaciones curriculares
- **Recuperación**: Planes de recuperación para alumnos

## 🔧 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Autenticación**: Supabase Auth
- **Base de Datos**: Supabase PostgreSQL
- **Iconos**: Lucide React
- **Gráficos**: Recharts

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd trazo-lomloe
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear Proyecto en Supabase

1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto o usa uno existente
3. Anota la URL y la anon key

#### 3.2 Ejecutar el Esquema SQL

1. Ve al **SQL Editor** de Supabase
2. Copia el contenido de `SUPABASE_SCHEMA.sql`
3. Ejecuta el script SQL

#### 3.3 Configurar Credenciales

Edita `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
```

#### 3.4 Crear Usuarios

En **Authentication** > **Users**, crea los usuarios:

- carmen.prieto@educantabria.es / Trazo2025! (admin)
- laura.gomez@educantabria.es / Trazo2025! (profesor)
- miguel.ruiz@educantabria.es / Trazo2025! (profesor)

### 4. Ejecutar la Aplicación

#### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

#### Modo Producción

```bash
npm run build
npm run preview
```

## 📖 Uso

### Primer Inicio

1. Accede a la aplicación
2. Inicia sesión con uno de los usuarios
3. La aplicación cargará los datos de demostración
4. Los datos se sincronizarán automáticamente con Supabase

### Funcionalidades Principales

#### Panel de Control
- Vista general del estado del curso
- Acceso rápido a todas las funcionalidades
- Estadísticas y métricas

#### Programaciones
- Crear y editar programaciones didácticas
- Definir criterios de evaluación
- Establecer ponderaciones

#### Situaciones de Aprendizaje
- Diseñar SA con actividades detalladas
- Vincular criterios de evaluación
- Gestionar temporalización
- Adjuntar archivos PDF a actividades

#### Cuaderno del Profesor
- Registro diario de asistencia
- Calificaciones por actividad
- Observaciones del alumnado
- Rúbricas de evaluación

#### Informes
- Generar informes individuales
- Crear informes de grupo
- Exportar a PDF
- Análisis de competencias

#### Configuración
- Gestionar grupos y alumnos
- Importar alumnos desde CSV
- Configurar asignaturas
- Administrar usuarios

## 🔄 Sincronización de Datos

La aplicación usa un sistema híbrido:

1. **localStorage**: Datos disponibles inmediatamente
2. **Supabase**: Sincronización en la nube
3. **Fallback**: Si Supabase falla, usa localStorage

### Flujo de Sincronización

```
Usuario hace cambio
    ↓
Se guarda en localStorage (inmediato)
    ↓
Se intenta sincronizar con Supabase (async)
    ↓
Si Supabase falla → datos en localStorage
Si Supabase funciona → datos en la nube
```

## 📁 Estructura del Proyecto

```
trazo-lomloe/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── data/            # Datos y configuración
│   ├── lib/             # Utilidades y servicios
│   ├── views/           # Vistas principales
│   ├── App.tsx          # Componente principal
│   ├── Root.tsx         # Root con autenticación
│   ├── store.tsx        # Estado global
│   └── main.tsx         # Punto de entrada
├── public/              # Archivos estáticos
├── SUPABASE_SCHEMA.sql  # Esquema de base de datos
├── CONFIGURACION_SUPABASE.md  # Guía de configuración
└── README.md           # Este archivo
```

## 🔐 Seguridad

### Autenticación
- Supabase Auth para autenticación segura
- Tokens JWT en cada petición
- Sesiones persistentes

### Autorización
- Row Level Security (RLS) en Supabase
- Políticas por tabla
- Control de acceso por rol

### Datos
- Encriptación en tránsito (HTTPS)
- Encriptación en reposo
- Backups automáticos

## 🐛 Solución de Problemas

### La aplicación no carga
- Verifica que Supabase esté configurado correctamente
- Revisa la consola del navegador (F12)
- Comprueba que las credenciales sean correctas

### Error de autenticación
- Verifica que los usuarios estén creados en Supabase
- Comprueba que las contraseñas sean correctas
- Asegúrate de que los usuarios estén confirmados

### Los datos no se sincronizan
- Verifica la conexión a internet
- Comprueba las políticas RLS en Supabase
- Revisa los logs en Supabase Dashboard

## 📊 Base de Datos

### Tablas Principales

- **teachers**: Profesores y jefatura
- **groups**: Grupos de alumnos
- **students**: Alumnos
- **subjects**: Asignaturas
- **programaciones**: Programaciones didácticas
- **situaciones_aprendizaje**: Situaciones de aprendizaje
- **units**: Unidades didácticas
- **instruments**: Instrumentos de evaluación
- **grades**: Calificaciones
- **attendance**: Asistencia
- **observations**: Observaciones
- **measures**: Medidas de atención a la diversidad
- **recoveries**: Planes de recuperación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es propiedad del IES Lope de Vega para uso educativo.

## 👥 Autores

- **Departamento de Dibujo** - IES Lope de Vega
- **Desarrollo** - Equipo de desarrollo TRAZO

## 📞 Soporte

Para soporte técnico:
1. Revisa la documentación en `CONFIGURACION_SUPABASE.md`
2. Consulta los logs en Supabase Dashboard
3. Revisa la consola del navegador

## 🎓 Agradecimientos

- IES Lope de Vega por el apoyo al proyecto
- Comunidad educativa de Cantabria
- Equipo de desarrollo de Supabase

---

**Versión**: 1.0.0  
**Última actualización**: 2026  
**Estado**: ✅ Producción
