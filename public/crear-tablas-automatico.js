// Script para crear tablas y datos directamente en Supabase
// Ejecutar en la consola del navegador (F12)

async function crearTablasYDatos() {
  const SUPABASE_URL = 'https://hhsmjmgxarxofyigystd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o';
  
  console.log('🚀 Iniciando creación de tablas y datos...\n');
  
  // 1. Verificar si la tabla teachers existe
  console.log('1️⃣ Verificando tabla teachers...');
  try {
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/teachers?select=id&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (checkResponse.status === 404) {
      console.log('❌ La tabla teachers NO existe');
      console.log('⚠️  Necesitas ejecutar el SQL en Supabase SQL Editor');
      console.log('📋 Archivo: public/sql/configuracion-completa.sql');
      return false;
    } else if (checkResponse.ok) {
      console.log('✅ La tabla teachers existe');
    }
  } catch (error) {
    console.error('❌ Error verificando tabla:', error.message);
    return false;
  }
  
  // 2. Insertar profesores
  console.log('\n2️⃣ Insertando profesores...');
  const teachers = [
    { id: 't1', email: 'laura.gomez@educantabria.es', nombre: 'Laura Gómez', rol: 'profesor', color: '#0e7c66' },
    { id: 't2', email: 'miguel.ruiz@educantabria.es', nombre: 'Miguel Ruiz', rol: 'profesor', color: '#2c6e8f' },
    { id: 't3', email: 'carmen.prieto@educantabria.es', nombre: 'Carmen Prieto', rol: 'admin', color: '#d9532c' }
  ];
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/teachers`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(teachers)
    });
    
    if (response.ok || response.status === 201) {
      console.log('✅ Profesores insertados correctamente');
    } else {
      const errorText = await response.text();
      console.error('❌ Error insertando profesores:', response.status, errorText);
      
      if (errorText.includes('duplicate key')) {
        console.log('ℹ️  Los profesores ya existen, actualizando...');
        
        // Actualizar cada profesor
        for (const teacher of teachers) {
          await fetch(`${SUPABASE_URL}/rest/v1/teachers?id=eq.${teacher.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacher)
          });
        }
        console.log('✅ Profesores actualizados');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // 3. Verificar resultado
  console.log('\n3️⃣ Verificando resultado...');
  const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/teachers?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  const data = await verifyResponse.json();
  console.log(`📊 Profesores en Supabase: ${data.length}`);
  console.log('👥 Lista:', data);
  
  if (data.length === 3) {
    console.log('\n✅ ¡ÉXITO! Las tablas existen y los datos están insertados');
    console.log('🔄 Recarga la página (Ctrl + Shift + R)');
    return true;
  } else {
    console.log('\n❌ PROBLEMA: No se pudieron insertar los datos');
    console.log('📋 Solución: Ejecuta el SQL completo en Supabase SQL Editor');
    console.log('📄 Archivo: public/sql/configuracion-completa.sql');
    return false;
  }
}

// Ejecutar el script
crearTablasYDatos();
