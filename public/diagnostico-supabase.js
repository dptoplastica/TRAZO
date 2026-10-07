// Script de diagnóstico completo de Supabase
// Ejecutar en la consola del navegador (F12)

async function diagnosticoCompleto() {
  const SUPABASE_URL = 'https://hhsmjmgxarxofyigystd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o';
  
  console.log('🔍 === DIAGNÓSTICO COMPLETO DE SUPABASE ===\n');
  
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
      console.log('✅ Conexión con Supabase: OK');
    } else {
      console.error('❌ Error de conexión:', response.status);
      return;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return;
  }
  
  // 2. Verificar tablas existentes
  console.log('\n2️⃣ Verificando tablas...');
  const tablas = [
    'teachers', 'groups', 'students', 'subjects', 
    'programaciones', 'situaciones_aprendizaje', 'units',
    'instruments', 'grades', 'attendance', 'observations',
    'measures', 'recoveries'
  ];
  
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
      } else {
        const errorText = await response.text();
        resultados[tabla] = 'ERROR';
        console.error(`  ❌ ${tabla}: Error ${response.status}`);
        
        // Si el error es 404, la tabla no existe
        if (response.status === 404) {
          console.error(`     → La tabla "${tabla}" NO EXISTE`);
          console.error(`     → Necesitas ejecutar el SQL de creación de tablas`);
        }
      }
    } catch (error) {
      resultados[tabla] = 'ERROR';
      console.error(`  ❌ ${tabla}: ${error.message}`);
    }
  }
  
  // 3. Resumen
  console.log('\n3️⃣ === RESUMEN ===');
  const tablasOK = Object.entries(resultados).filter(([k, v]) => typeof v === 'number');
  const tablasError = Object.entries(resultados).filter(([k, v]) => v === 'ERROR');
  
  console.log(`✅ Tablas OK: ${tablasOK.length}`);
  console.log(`❌ Tablas con error: ${tablasError.length}`);
  
  if (tablasError.length > 0) {
    console.log('\n⚠️  PROBLEMA DETECTADO:');
    console.log('Algunas tablas no existen o tienen errores.');
    console.log('\n📋 SOLUCIÓN:');
    console.log('1. Ve a Supabase Dashboard → SQL Editor');
    console.log('2. Ejecuta el archivo: public/sql/cambiar-uuid-a-text.sql');
    console.log('3. Luego ejecuta: public/sql/insertar-datos-iniciales.sql');
    console.log('4. Recarga la página y vuelve a ejecutar este diagnóstico');
  } else if (resultados['teachers'] === 0) {
    console.log('\n⚠️  PROBLEMA DETECTADO:');
    console.log('Las tablas existen pero están vacías.');
    console.log('\n📋 SOLUCIÓN:');
    console.log('1. Ve a Supabase Dashboard → SQL Editor');
    console.log('2. Ejecuta el archivo: public/sql/insertar-datos-iniciales.sql');
    console.log('3. Recarga la página y vuelve a ejecutar este diagnóstico');
  } else {
    console.log('\n✅ TODO CORRECTO:');
    console.log('Supabase está configurado correctamente.');
    console.log('Los cambios deberían ser permanentes.');
  }
  
  return resultados;
}

// Ejecutar diagnóstico
diagnosticoCompleto();
