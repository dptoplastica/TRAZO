// Script de diagnóstico de Supabase - Ejecutar en la consola del navegador (F12)
// Este script NO usa import.meta.env, funciona directamente en la consola

async function diagnosticarSupabase() {
  // IMPORTANTE: Reemplaza estas credenciales con las tuyas reales de Supabase
  // Ve a: Settings → API Keys en tu dashboard de Supabase
  const SUPABASE_URL = 'https://hhsmjmgxarxofyigystd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o'; // ← CAMBIA ESTA CLAVE
  
  console.log('🔍 === DIAGNÓSTICO DE SUPABASE ===\n');
  console.log('📍 URL:', SUPABASE_URL);
  console.log('🔑 Key:', SUPABASE_KEY.substring(0, 30) + '...\n');
  
  // 1. Verificar conexión básica
  console.log('1️⃣ Verificando conexión...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexión con Supabase: OK\n');
    } else {
      const errorText = await response.text();
      console.error('❌ Error de conexión:', response.status, response.statusText);
      console.error('Detalles:', errorText);
      
      if (response.status === 401) {
        console.error('\n⚠️  La clave API es inválida');
        console.error('📋 SOLUCIÓN:');
        console.error('1. Ve a tu dashboard de Supabase');
        console.error('2. Settings → API Keys');
        console.error('3. Copia la "Publishable key" completa');
        console.error('4. Reemplaza SUPABASE_KEY en este script');
        console.error('5. Vuelve a ejecutar el script');
      }
      return;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return;
  }
  
  // 2. Verificar tablas
  console.log('2️⃣ Verificando tablas...');
  const tablas = [
    'teachers', 'groups', 'students', 'subjects', 
    'programaciones', 'situaciones_aprendizaje', 'units',
    'instruments', 'grades', 'attendance', 'observations',
    'measures', 'recoveries'
  ];
  
  let tablasOk = 0;
  const resultados = {};
  
  for (const tabla of tablas) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        resultados[tabla] = data.length;
        console.log(`  ✅ ${tabla}: ${data.length} registros`);
        tablasOk++;
      } else {
        resultados[tabla] = 'ERROR';
        console.error(`  ❌ ${tabla}: Error ${response.status}`);
        
        if (response.status === 404) {
          console.error(`     → La tabla "${tabla}" NO EXISTE`);
        } else if (response.status === 401) {
          console.error(`     → Error de permisos (RLS activo)`);
        }
      }
    } catch (error) {
      resultados[tabla] = 'ERROR';
      console.error(`  ❌ ${tabla}: ${error.message}`);
    }
  }
  
  // 3. Verificar profesores
  console.log('\n3️⃣ Verificando profesores...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/teachers?select=id,email,nombre,rol`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok) {
      const teachers = await response.json();
      console.log(`\n👥 Profesores (${teachers.length}):`);
      teachers.forEach(t => {
        console.log(`   - ${t.nombre} (${t.email}) - ${t.rol}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // 4. Resumen
  console.log('\n4️⃣ === RESUMEN ===');
  console.log(`✅ Tablas OK: ${tablasOk}/${tablas.length}`);
  
  if (tablasOk === tablas.length) {
    console.log('\n🎉 ¡TODO CORRECTO!');
    console.log('✅ Supabase está configurado correctamente');
    console.log('✅ La conexión funciona perfectamente');
    console.log('\n📊 Total de registros:');
    Object.entries(resultados).forEach(([tabla, count]) => {
      console.log(`   - ${tabla}: ${count}`);
    });
  } else {
    console.log('\n⚠️  PROBLEMAS DETECTADOS');
    
    if (resultados['teachers'] === 'ERROR') {
      console.log('\n❌ La tabla "teachers" tiene problemas');
      console.log('   Posibles causas:');
      console.log('   1. La tabla no existe → Ejecuta el SQL de creación');
      console.log('   2. RLS está activo → Ejecuta: ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;');
      console.log('   3. No hay datos → Ejecuta el SQL de inserción de profesores');
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Ve a Supabase SQL Editor');
    console.log('2. Ejecuta: public/sql/desactivar-rls.sql');
    console.log('3. Ejecuta: public/sql/configuracion-completa.sql');
    console.log('4. Vuelve a ejecutar este diagnóstico');
  }
  
  return resultados;
}

// Ejecutar diagnóstico
diagnosticarSupabase();
