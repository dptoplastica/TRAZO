# 🌐 Configuración de Supabase para TRAZO

## ✅ Estado Actual

La aplicación TRAZO ahora está configurada para usar **Supabase + localStorage** en modo híbrido:
- ✅ **Supabase** como fuente principal de datos (nube)
- ✅ **localStorage** como caché local (respaldo)
- ✅ Sincronización automática en segundo plano
- ✅ Funciona offline si Supabase no está disponible

---

## 🚀 Configuración Paso a Paso

### **Paso 1: Verificar tu Proyecto de Supabase**

Tu proyecto ya está configurado:
- **URL**: https://hhsmjmgxarxofyigystd.supabase.co
- **Key**: sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o

### **Paso 2: Crear las Tablas en Supabase**

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/hhsmjmgxarxofyigystd

2. Ve a **SQL Editor** (menú lateral)

3. Haz clic en **"New Query"**

4. Copia y pega el siguiente SQL:

```sql
-- ============================================
-- SCRIPT COMPLETO PARA CONFIGURAR SUPABASE
-- ============================================

-- Eliminar tablas existentes si las hay
DROP TABLE IF EXISTS recoveries CASCADE;
DROP TABLE IF EXISTS measures CASCADE;
DROP TABLE IF EXISTS observations CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS instruments CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS situaciones_aprendizaje CASCADE;
DROP TABLE IF EXISTS programaciones CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

-- ============================================
-- CREAR TABLAS
-- ============================================

CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'profesor')),
  color TEXT DEFAULT '#0e7c66',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,
  tutor_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  dias INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  base DECIMAL(3,2) DEFAULT 6.5,
  neae TEXT,
  abs_rate DECIMAL(3,2) DEFAULT 0.05,
  hue INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  corto TEXT NOT NULL,
  etapa TEXT NOT NULL,
  nivel TEXT NOT NULL,
  curriculum_id TEXT NOT NULL,
  teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
  color TEXT DEFAULT '#0e7c66',
  tipo TEXT NOT NULL CHECK (tipo IN ('obligatoria', 'optativa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE programaciones (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  curso TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Borrador', 'En revisión', 'Finalizada')),
  contexto JSONB DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  ponderaciones JSONB DEFAULT '{}',
  ccalificacion TEXT DEFAULT '',
  anexos JSONB DEFAULT '[]',
  actualizada DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE situaciones_aprendizaje (
  id TEXT PRIMARY KEY,
  programacion_id TEXT REFERENCES programaciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  eva INTEGER NOT NULL CHECK (eva IN (1, 2, 3)),
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  sesiones INTEGER NOT NULL,
  justificacion TEXT DEFAULT '',
  reto TEXT DEFAULT '',
  producto TEXT DEFAULT '',
  metodologias TEXT[] DEFAULT '{}',
  agrupamientos TEXT DEFAULT '',
  espacios TEXT DEFAULT '',
  recursos TEXT DEFAULT '',
  diversidad TEXT DEFAULT '',
  evidencias TEXT DEFAULT '',
  criterios TEXT[] DEFAULT '{}',
  objetivos TEXT[] DEFAULT '{}',
  actividades JSONB DEFAULT '[]',
  instrumentos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE units (
  id TEXT PRIMARY KEY,
  programacion_id TEXT REFERENCES programaciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  sesiones INTEGER NOT NULL,
  sa_ids TEXT[] DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE instruments (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  peso INTEGER NOT NULL,
  criterio_ids TEXT[] DEFAULT '{}',
  fecha DATE,
  rubrica JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grades (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  instrumento_id TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  value DECIMAL(3,1) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('P', 'F', 'R')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  texto TEXT NOT NULL,
  autor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE measures (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE recoveries (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  criterio_id TEXT NOT NULL,
  actividad TEXT NOT NULL,
  fecha DATE NOT NULL,
  instrumento_id TEXT NOT NULL,
  resultado DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DESACTIVAR RLS (Row Level Security)
-- ============================================
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE programaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE situaciones_aprendizaje DISABLE ROW LEVEL SECURITY;
ALTER TABLE units DISABLE ROW LEVEL SECURITY;
ALTER TABLE instruments DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE measures DISABLE ROW LEVEL SECURITY;
ALTER TABLE recoveries DISABLE ROW LEVEL SECURITY;

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c');

INSERT INTO groups (id, nombre, nivel, tutor_id, dias) VALUES
  ('g1', '4º ESO A', '4º ESO', 't1', ARRAY[1, 3]),
  ('g2', '1º Bach A', '1º Bachillerato', 't1', ARRAY[2, 4]),
  ('g3', '2º Bach B', '2º Bachillerato', 't2', ARRAY[1, 4]),
  ('g4', '1º Bach B', '1º Bachillerato', 't2', ARRAY[2, 5]),
  ('g5', '1º Bach C', '1º Bachillerato', 't1', ARRAY[3, 5]),
  ('g6', '2º Bach A', '2º Bachillerato', 't1', ARRAY[1, 3, 4]);

INSERT INTO subjects (id, nombre, corto, etapa, nivel, curriculum_id, teacher_id, group_id, color, tipo) VALUES
  ('m1', 'Educación Plástica, Visual y Audiovisual', 'EPVA', 'ESO', '4º ESO', 'epva-eso', 't1', 'g1', '#d9532c', 'optativa'),
  ('m2', 'Expresión Artística', 'Expr. Artística', 'Bachillerato', '1º Bachillerato', 'ea-bach', 't1', 'g2', '#c98a12', 'obligatoria'),
  ('m3', 'Dibujo Técnico II', 'Dibujo Técnico II', 'Bachillerato', '2º Bachillerato', 'dt-bach', 't2', 'g3', '#2c6e8f', 'obligatoria'),
  ('m4', 'Audiovisual y Multimedia', 'Audiovisual', 'ESO', '4º ESO', 'epva-eso', NULL, 'g1', '#7a5fb0', 'optativa'),
  ('m5', 'Dibujo Técnico I', 'Dibujo Técnico I', 'Bachillerato', '1º Bachillerato', 'dt1-bach', 't2', 'g4', '#0e7c66', 'obligatoria'),
  ('m6', 'Taller de Podcast', 'Podcast', 'Bachillerato', '1º Bachillerato', 'tp-bach', 't1', 'g5', '#a84a6c', 'optativa'),
  ('m7', 'Taller de Cortometraje', 'Cortometraje', 'Bachillerato', '2º Bachillerato', 'tc-bach', 't1', 'g6', '#7a5fb0', 'optativa');

-- Verificar resultado
SELECT '✅ CONFIGURACIÓN COMPLETADA' AS mensaje;
SELECT 'Profesores:' AS tabla, COUNT(*) AS cantidad FROM teachers
UNION ALL
SELECT 'Grupos:', COUNT(*) FROM groups
UNION ALL
SELECT 'Asignaturas:', COUNT(*) FROM subjects;
```

5. Haz clic en **"Run"** (botón verde)

6. Deberías ver el mensaje: `✅ CONFIGURACIÓN COMPLETADA`

### **Paso 3: Verificar que las Tablas se Crearon**

1. Ve a **Table Editor** (menú lateral)
2. Deberías ver 13 tablas:
   - teachers
   - groups
   - students
   - subjects
   - programaciones
   - situaciones_aprendizaje
   - units
   - instruments
   - grades
   - attendance
   - observations
   - measures
   - recoveries

3. Haz clic en la tabla **teachers**
4. Deberías ver 3 profesores:
   - Laura Gómez
   - Miguel Ruiz
   - Carmen Prieto

### **Paso 4: Migrar tus Datos Locales a Supabase**

Si ya tienes datos en localStorage y quieres migrarlos a Supabase:

1. Abre tu aplicación TRAZO en el navegador
2. Abre la consola del navegador (F12)
3. Copia y pega este script:

```javascript
// Script de migración de localStorage a Supabase
async function migrarDatos() {
  console.log('🚀 Iniciando migración de datos a Supabase...\n');

  // Cargar datos desde localStorage
  const localData = JSON.parse(localStorage.getItem('trazo-lomloe-v24'));
  
  if (!localData) {
    console.error('❌ No hay datos en localStorage');
    return;
  }

  console.log('✅ Datos cargados desde localStorage');
  console.log(`📊 ${localData.teachers.length} profesores`);
  console.log(`📊 ${localData.groups.length} grupos`);
  console.log(`📊 ${localData.students.length} alumnos`);
  console.log(`📊 ${localData.subjects.length} asignaturas`);
  console.log(`📊 ${localData.programaciones.length} programaciones`);
  console.log(`📊 ${localData.sas.length} situaciones de aprendizaje`);
  console.log('');

  // Configuración de Supabase
  const SUPABASE_URL = 'https://hhsmjmgxarxofyigystd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o';

  // Función para subir datos
  async function uploadTable(tableName, data) {
    console.log(`📤 Subiendo ${tableName}...`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal,resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok || response.status === 201) {
        console.log(`✅ ${tableName} subido correctamente (${data.length} registros)`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ Error subiendo ${tableName}:`, errorText);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error subiendo ${tableName}:`, error.message);
      return false;
    }
  }

  // Subir todas las tablas
  const results = await Promise.all([
    uploadTable('teachers', localData.teachers),
    uploadTable('groups', localData.groups),
    uploadTable('students', localData.students),
    uploadTable('subjects', localData.subjects),
    uploadTable('programaciones', localData.programaciones),
    uploadTable('situaciones_aprendizaje', localData.sas),
    uploadTable('units', localData.units),
    uploadTable('instruments', localData.instruments),
    uploadTable('grades', localData.grades),
    uploadTable('attendance', localData.attendance),
    uploadTable('observations', localData.observations),
    uploadTable('measures', localData.measures),
    uploadTable('recoveries', localData.recoveries),
  ]);

  console.log('');
  const successCount = results.filter(r => r).length;
  const totalCount = results.length;

  if (successCount === totalCount) {
    console.log('✅ ¡Migración completada exitosamente!');
    console.log(`📊 ${successCount}/${totalCount} tablas subidas correctamente`);
    console.log('');
    console.log('🎉 Ahora puedes acceder a tus datos desde cualquier dispositivo');
  } else {
    console.error(`❌ Migración incompleta: ${successCount}/${totalCount} tablas`);
    console.error('Revisa los errores arriba y vuelve a intentarlo');
  }
}

// Ejecutar migración
migrarDatos();
```

4. Presiona Enter
5. Espera a que termine la migración
6. Deberías ver: `✅ ¡Migración completada exitosamente!`

### **Paso 5: Probar la Sincronización**

1. Recarga la aplicación (Ctrl + Shift + R)
2. Abre la consola (F12)
3. Deberías ver:
   ```
   🔄 Cargando datos...
   ✅ Datos cargados desde Supabase
   💾 Datos guardados en localStorage
   ✅ Datos sincronizados con Supabase
   ```

4. Haz un cambio (ej: editar un profesor)
5. Recarga la página
6. El cambio debería persistir

### **Paso 6: Probar Multi-Dispositivo**

1. Abre la aplicación en otro navegador o dispositivo
2. Inicia sesión con el mismo usuario
3. Los datos deberían sincronizarse automáticamente

---

## 🔍 Verificar que Todo Funciona

### **Script de Verificación**

Ejecuta esto en la consola del navegador:

```javascript
async function verificarSupabase() {
  const SUPABASE_URL = 'https://hhsmjmgxarxofyigystd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o';
  
  console.log('🔍 Verificando conexión con Supabase...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/teachers?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa con Supabase');
      console.log('📊 Profesores encontrados:', data.length);
      console.log('👥 Lista de profesores:', data);
      return data;
    } else {
      console.error('❌ Error en la respuesta:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return null;
  }
}

verificarSupabase();
```

---

## 📊 Cómo Funciona la Sincronización

### **Flujo de Datos:**

```
┌─────────────────────────────────────────────────────────┐
│                    APLICACIÓN TRAZO                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Usuario hace cambios  │
              └─────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  localStorage    │      │    Supabase      │
    │  (caché local)   │      │   (nube)         │
    │  ⚡ Inmediato    │      │  🌐 Sincronizado │
    └──────────────────┘      └──────────────────┘
              │                           │
              │                           │
              └───────────┬───────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  Sincronización en      │
              │  segundo plano          │
              └─────────────────────────┘
```

### **Ventajas:**

✅ **Funciona offline**: Si no hay conexión, usa localStorage
✅ **Sincronización automática**: Los cambios se guardan en la nube
✅ **Multi-dispositivo**: Accede desde cualquier lugar
✅ **Backup automático**: Supabase hace backups diarios
✅ **Rápido**: localStorage como caché para carga instantánea

---

## 🐛 Solución de Problemas

### **Problema: "No hay profesores en la base de datos"**

**Solución:**
1. Verifica que ejecutaste el SQL en Supabase
2. Ve a Table Editor → teachers
3. Deberías ver 3 profesores
4. Si no, ejecuta el SQL nuevamente

### **Problema: "Error al sincronizar con Supabase"**

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que las credenciales de Supabase son correctas
3. Abre la consola (F12) y revisa los errores
4. Los datos siguen guardados en localStorage

### **Problema: "Los datos no se sincronizan entre dispositivos"**

**Solución:**
1. Asegúrate de que ambos dispositivos usan la misma cuenta de Supabase
2. Recarga la página en ambos dispositivos
3. Verifica que el script de migración se ejecutó correctamente

### **Problema: "La aplicación es lenta"**

**Solución:**
1. La primera carga puede ser lenta (carga desde Supabase)
2. Las siguientes cargas serán rápidas (usa localStorage como caché)
3. Si persiste, verifica tu conexión a internet

---

## 📝 Resumen

### **Estado Actual:**
- ✅ Supabase configurado
- ✅ Sincronización híbrida implementada
- ✅ localStorage como caché local
- ✅ Funciona offline
- ✅ Multi-dispositivo

### **Próximos Pasos:**
1. Ejecutar el SQL en Supabase
2. Migrar datos locales (si los tienes)
3. Probar la sincronización
4. Acceder desde otro dispositivo

### **Credenciales de Acceso:**
- **URL**: https://hhsmjmgxarxofyigystd.supabase.co
- **Key**: sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver los mensajes de diagnóstico y comparte los errores si necesitas asistencia adicional.

¡Tu aplicación TRAZO ahora está lista para usar en cualquier lugar! 🌐
