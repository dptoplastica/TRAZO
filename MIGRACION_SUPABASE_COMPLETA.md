# 🚀 Migración Completa a Supabase - Guía Paso a Paso

## 📋 Visión General

Esta guía te ayudará a migrar TRAZO de localStorage a **100% Supabase**, eliminando completamente el almacenamiento local.

**Beneficios:**
- ✅ Datos sincronizados en tiempo real
- ✅ Acceso desde cualquier dispositivo
- ✅ Multi-usuario simultáneo
- ✅ Backup automático
- ✅ Sin pérdida de datos

**Requisitos:**
- ⚠️ Modificación de 15+ archivos
- ⚠️ Tiempo estimado: 2-3 horas
- ⚠️ Conocimientos de React y TypeScript

---

## 🎯 Estrategia de Migración

### **Fase 1: Preparación** (30 min)
1. Configurar Supabase completamente
2. Crear tablas y políticas RLS
3. Probar conexión

### **Fase 2: Modificación del Store** (45 min)
1. Actualizar `store.tsx` para usar solo Supabase
2. Añadir manejo de estados de carga
3. Implementar sincronización en tiempo real

### **Fase 3: Actualización de Componentes** (60 min)
1. Actualizar todos los componentes para manejar `d: AppData | null`
2. Añadir pantallas de carga
3. Manejar errores de conexión

### **Fase 4: Pruebas** (30 min)
1. Probar todas las funcionalidades
2. Verificar sincronización
3. Probar multi-usuario

---

## 🔧 Paso 1: Configurar Supabase

### **1.1 Verificar Proyecto**

Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/hhsmjmgxarxofyigystd

### **1.2 Ejecutar el Esquema SQL**

Si no lo has hecho aún, ejecuta `SUPABASE_SCHEMA.sql` en el SQL Editor.

### **1.3 Crear Usuarios**

Ve a **Authentication** → **Users** y crea:

| Email | Contraseña | Rol |
|-------|------------|-----|
| carmen.prieto@educantabria.es | Trazo2025! | admin |
| laura.gomez@educantabria.es | Trazo2025! | profesor |
| miguel.ruiz@educantabria.es | Trazo2025! | profesor |

**Importante:** Marca "Auto Confirm User" para cada usuario.

### **1.4 Insertar Datos Iniciales**

Ejecuta este SQL para crear los profesores en la tabla `teachers`:

```sql
INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c')
ON CONFLICT (id) DO NOTHING;
```

### **1.5 Probar Conexión**

En la consola del navegador (F12), ejecuta:

```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://hhsmjmgxarxofyigystd.supabase.co',
  'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o'
);

// Probar lectura
const { data, error } = await supabase.from('teachers').select('*');
console.log('Profesores:', data);
console.log('Error:', error);
```

---

## 🔧 Paso 2: Modificar el Store

### **2.1 Crear Nuevo Store**

Reemplaza `src/store.tsx` con este código:

```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadAppData, saveTable, subscribeToChanges } from "./lib/dataService";
import { getCurrentUser } from "./lib/auth";
import type { AppData } from "./data/seed";
import { getCurriculum, allCriterios, ceById, clavesDeCE, type Curriculum, type Criterio } from "./data/curriculum";

export type ViewId =
  | "panel" | "programaciones" | "curriculo" | "situaciones" | "unidades"
  | "temporalizacion" | "evaluacion" | "cuaderno" | "alumnado" | "informes"
  | "diversidad" | "recuperacion" | "config";

export interface Params { 
  programacionId?: string; 
  saId?: string; 
  groupId?: string; 
  studentId?: string; 
  subjectId?: string; 
}

interface Toast { 
  msg: string; 
  key: number; 
}

interface Ctx {
  d: AppData | null;
  view: ViewId;
  params: Params;
  toast: Toast | null;
  loading: boolean;
  me: AppData["teachers"][number] | null;
  isAdmin: boolean;
  set: (fn: (d: AppData) => AppData) => Promise<void>;
  nav: (view: ViewId, params?: Params) => void;
  notify: (msg: string) => void;
  refresh: () => Promise<void>;
  reset: () => Promise<void>;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<AppData | null>(null);
  const [view, setView] = useState<ViewId>("panel");
  const [params, setParams] = useState<Params>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        console.log('🚀 Inicializando desde Supabase...');
        
        const user = await getCurrentUser();
        if (!user) {
          console.warn('⚠️ No hay usuario autenticado');
          setLoading(false);
          return;
        }
        setCurrentUser(user);

        const data = await loadAppData();
        if (data) {
          data.teacherId = user.id;
          data.role = user.rol;
          setD(data);
          console.log('✅ Datos cargados desde Supabase');
        }
      } catch (error) {
        console.error('❌ Error inicializando:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();

    const unsubscribe = subscribeToChanges(() => {
      console.log('🔄 Cambios detectados, recargando...');
      loadAppData().then(data => {
        if (data && currentUser) {
          data.teacherId = currentUser.id;
          data.role = currentUser.rol;
          setD(data);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateData = async (fn: (d: AppData) => AppData) => {
    if (!d) return;

    const newData = fn(d);
    setD(newData);

    try {
      await Promise.all([
        saveTable('teachers', newData.teachers),
        saveTable('groups', newData.groups),
        saveTable('students', newData.students),
        saveTable('subjects', newData.subjects),
        saveTable('programaciones', newData.programaciones),
        saveTable('situaciones_aprendizaje', newData.sas),
        saveTable('units', newData.units),
        saveTable('instruments', newData.instruments),
        saveTable('grades', newData.grades),
        saveTable('attendance', newData.attendance),
        saveTable('observations', newData.observations),
        saveTable('measures', newData.measures),
        saveTable('recoveries', newData.recoveries),
      ]);
      console.log('✅ Datos guardados en Supabase');
    } catch (error) {
      console.error('❌ Error guardando:', error);
    }
  };

  const refresh = async () => {
    const data = await loadAppData();
    if (data && currentUser) {
      data.teacherId = currentUser.id;
      data.role = currentUser.rol;
      setD(data);
    }
  };

  const reset = async () => {
    // Implementar lógica de reset si es necesario
    await refresh();
  };

  const value: Ctx = {
    d,
    view,
    params,
    toast,
    loading,
    me: d?.teachers.find((t) => t.id === d.teacherId) || null,
    isAdmin: d?.role === "admin" || false,
    set: updateData,
    nav: (v, p) => { 
      setView(v); 
      setParams(p ?? {}); 
      window.scrollTo({ top: 0 }); 
    },
    notify: (msg) => setToast({ msg, key: Date.now() }),
    refresh,
    reset,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

// Funciones auxiliares (copiar del store original)
// ... [Añadir todas las funciones auxiliares del store original]
```

**Nota:** Necesitas copiar todas las funciones auxiliares del store original (fmtFecha, cursoInfo, critScore, finalGrade, etc.)

---

## 🔧 Paso 3: Actualizar Componentes

### **3.1 Patrón de Actualización**

Para cada componente, sigue este patrón:

**Antes:**
```typescript
const { d, nav, set } = useApp();
const students = d.students.filter(...);
```

**Después:**
```typescript
const { d, nav, set, loading } = useApp();

if (loading || !d) {
  return <div>Cargando...</div>;
}

const students = d.students.filter(...);
```

### **3.2 Ejemplo: Panel.tsx**

```typescript
export default function Panel() {
  const { d, nav, me, loading } = useApp();

  if (loading || !d || !me) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vir mx-auto mb-4"></div>
          <p className="text-ink2">Cargando datos desde la nube...</p>
        </div>
      </div>
    );
  }

  // Resto del código normal
  const subjects = visibleSubjects(d);
  // ...
}
```

### **3.3 Componentes a Actualizar**

Actualiza estos archivos siguiendo el patrón anterior:

1. ✅ `src/views/Panel.tsx`
2. ✅ `src/views/Programaciones.tsx`
3. ✅ `src/views/Situaciones.tsx`
4. ✅ `src/views/Unidades.tsx`
5. ✅ `src/views/Temporalizacion.tsx`
6. ✅ `src/views/Evaluacion.tsx`
7. ✅ `src/views/Cuaderno.tsx`
8. ✅ `src/views/Alumnado.tsx`
9. ✅ `src/views/Informes.tsx`
10. ✅ `src/views/Diversidad.tsx`
11. ✅ `src/views/Configuracion.tsx`
12. ✅ `src/components/layout.tsx`
13. ✅ `src/components/ui.tsx`

---

## 🔧 Paso 4: Actualizar Root.tsx

```typescript
import { useState, useEffect } from 'react';
import Login from './views/Login';
import App from './App';
import { signIn, signOut, getCurrentUser } from './lib/auth';

export default function Root() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const { user: authUser, error } = await signIn(email, password);
    
    if (error || !authUser) {
      return false;
    }
    
    setUser(authUser);
    return true;
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vir mx-auto mb-4"></div>
          <p className="text-ink2">Conectando con Supabase...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <App currentUser={user} onLogout={handleLogout} />;
}
```

---

## 🔧 Paso 5: Migrar Datos Existentes

### **5.1 Script de Migración**

Crea un archivo `migrate-to-supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hhsmjmgxarxofyigystd.supabase.co',
  'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o'
);

async function migrate() {
  // Cargar datos desde localStorage
  const localData = JSON.parse(localStorage.getItem('trazo-lomloe-v23'));
  
  if (!localData) {
    console.log('No hay datos locales para migrar');
    return;
  }

  console.log('Migrando datos a Supabase...');

  // Migrar cada tabla
  const tables = [
    { name: 'teachers', data: localData.teachers },
    { name: 'groups', data: localData.groups },
    { name: 'students', data: localData.students },
    { name: 'subjects', data: localData.subjects },
    { name: 'programaciones', data: localData.programaciones },
    { name: 'situaciones_aprendizaje', data: localData.sas },
    { name: 'units', data: localData.units },
    { name: 'instruments', data: localData.instruments },
    { name: 'grades', data: localData.grades },
    { name: 'attendance', data: localData.attendance },
    { name: 'observations', data: localData.observations },
    { name: 'measures', data: localData.measures },
    { name: 'recoveries', data: localData.recoveries },
  ];

  for (const table of tables) {
    console.log(`Migrando ${table.name}...`);
    const { error } = await supabase.from(table.name).upsert(table.data, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error migrando ${table.name}:`, error);
    } else {
      console.log(`✅ ${table.name} migrado (${table.data.length} registros)`);
    }
  }

  console.log('✅ Migración completada');
}

migrate().catch(console.error);
```

### **5.2 Ejecutar Migración**

```bash
node migrate-to-supabase.js
```

---

## 🔧 Paso 6: Pruebas

### **6.1 Checklist de Pruebas**

- [ ] Login funciona con Supabase Auth
- [ ] Los datos se cargan desde Supabase
- [ ] Crear un nuevo alumno → se guarda en Supabase
- [ ] Editar una programación → se actualiza en Supabase
- [ ] Abrir en otro navegador → los datos aparecen
- [ ] Cerrar sesión y volver a entrar → los datos persisten
- [ ] Multi-usuario: dos usuarios ven los mismos cambios

### **6.2 Probar Sincronización en Tiempo Real**

1. Abre TRAZO en dos navegadores diferentes
2. Inicia sesión con el mismo usuario en ambos
3. En el navegador 1, crea un nuevo alumno
4. En el navegador 2, verifica que aparece automáticamente

---

## 🐛 Solución de Problemas

### **Error: "No hay usuario autenticado"**
- Verifica que el usuario existe en Supabase Auth
- Verifica que el email coincide con la tabla `teachers`

### **Error: "Failed to load data from Supabase"**
- Verifica la conexión a internet
- Verifica las credenciales en `.env.local`
- Revisa las políticas RLS en Supabase

### **Los datos no se sincronizan**
- Verifica que `subscribeToChanges()` está configurado
- Revisa la consola para ver errores de WebSocket
- Verifica que las políticas RLS permiten lectura/escritura

---

## 📊 Comparación: Antes vs Después

| Característica | Antes (localStorage) | Después (Supabase) |
|----------------|---------------------|-------------------|
| **Ubicación** | Navegador local | Nube (PostgreSQL) |
| **Sincronización** | ❌ No | ✅ Tiempo real |
| **Multi-dispositivo** | ❌ No | ✅ Sí |
| **Multi-usuario** | ❌ No | ✅ Sí |
| **Backup** | ❌ Manual | ✅ Automático |
| **Offline** | ✅ Sí | ❌ No (requiere internet) |
| **Velocidad** | ⚡ Muy rápido | 🌐 Depende de conexión |

---

## 🎯 Resumen

### **Archivos a Modificar:**
1. `src/store.tsx` - Nuevo store basado en Supabase
2. `src/Root.tsx` - Autenticación con Supabase
3. `src/views/*.tsx` - 11 archivos de vistas
4. `src/components/*.tsx` - 2 archivos de componentes

### **Tiempo Estimado:**
- Preparación: 30 min
- Modificación del store: 45 min
- Actualización de componentes: 60 min
- Pruebas: 30 min
- **Total: ~2.5 horas**

### **Beneficios:**
- ✅ Datos siempre sincronizados
- ✅ Acceso desde cualquier dispositivo
- ✅ Colaboración en tiempo real
- ✅ Backup automático
- ✅ Escalable

---

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la documentación de Supabase: https://supabase.com/docs
2. Consulta los logs en la consola del navegador
3. Verifica las políticas RLS en Supabase

---

**¿Listo para migrar?** Sigue los pasos en orden y prueba cada fase antes de continuar.

¡Buena suerte! 🚀
