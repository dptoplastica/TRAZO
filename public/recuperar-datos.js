// Script para recuperar/regenerar datos de TRAZO
// Ejecutar en la consola del navegador (F12)

function recuperarDatos() {
  console.log('🔍 === RECUPERACIÓN DE DATOS ===\n');
  
  // 1. Verificar qué hay en localStorage
  console.log('1️⃣ Verificando localStorage...');
  
  const claves = Object.keys(localStorage);
  console.log(`   Claves encontradas: ${claves.length}`);
  claves.forEach(clave => {
    const tamaño = localStorage.getItem(clave).length;
    console.log(`   - ${clave}: ${tamaño} caracteres`);
  });
  
  // 2. Buscar datos de TRAZO
  console.log('\n2️⃣ Buscando datos de TRAZO...');
  
  const versiones = ['v24', 'v23', 'v22', 'v21', 'v20', 'v19'];
  let datosEncontrados = null;
  let versionEncontrada = null;
  
  for (const version of versiones) {
    const clave = `trazo-lomloe-${version}`;
    const datos = localStorage.getItem(clave);
    
    if (datos) {
      try {
        const parsed = JSON.parse(datos);
        console.log(`   ✅ Encontrados datos en ${clave}`);
        console.log(`      - Profesores: ${parsed.teachers?.length || 0}`);
        console.log(`      - Grupos: ${parsed.groups?.length || 0}`);
        console.log(`      - Alumnos: ${parsed.students?.length || 0}`);
        console.log(`      - Asignaturas: ${parsed.subjects?.length || 0}`);
        console.log(`      - Programaciones: ${parsed.programaciones?.length || 0}`);
        console.log(`      - SA: ${parsed.sas?.length || 0}`);
        
        datosEncontrados = parsed;
        versionEncontrada = version;
        break;
      } catch (e) {
        console.error(`   ❌ Error parseando ${clave}:`, e.message);
      }
    } else {
      console.log(`   ⚠️  No hay datos en ${clave}`);
    }
  }
  
  // 3. Si no hay datos, regenerar
  if (!datosEncontrados) {
    console.log('\n3️⃣ No se encontraron datos. Regenerando desde seed...');
    console.log('   ⚠️  Esto creará datos nuevos desde cero');
    console.log('   ⚠️  Los datos antiguos no se pueden recuperar');
    
    // Importar buildSeed dinámicamente
    import('/src/data/seed.ts').then(module => {
      const seedData = module.buildSeed();
      
      console.log('\n✅ Datos regenerados:');
      console.log(`   - Profesores: ${seedData.teachers.length}`);
      console.log(`   - Grupos: ${seedData.groups.length}`);
      console.log(`   - Alumnos: ${seedData.students.length}`);
      console.log(`   - Asignaturas: ${seedData.subjects.length}`);
      console.log(`   - Programaciones: ${seedData.programaciones.length}`);
      console.log(`   - SA: ${seedData.sas.length}`);
      
      // Guardar en localStorage
      localStorage.setItem('trazo-lomloe-v24', JSON.stringify(seedData));
      console.log('\n💾 Datos guardados en trazo-lomloe-v24');
      console.log('\n🔄 Recargando página...');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch(error => {
      console.error('❌ Error importando seed:', error);
      console.log('\n📋 SOLUCIÓN ALTERNATIVA:');
      console.log('1. Cierra la consola');
      console.log('2. Recarga la página (Ctrl + Shift + R)');
      console.log('3. Los datos se regenerarán automáticamente');
    });
    
    return;
  }
  
  // 4. Si hay datos, migrar a la versión actual
  console.log(`\n3️⃣ Datos encontrados en versión ${versionEncontrada}`);
  
  if (versionEncontrada !== 'v24') {
    console.log(`   ⚠️  Migrando de ${versionEncontrada} a v24...`);
    
    // Actualizar versión
    datosEncontrados.version = 24;
    
    // Guardar en la versión actual
    localStorage.setItem('trazo-lomloe-v24', JSON.stringify(datosEncontrados));
    console.log('   ✅ Datos migrados a v24');
    console.log('\n🔄 Recargando página...');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    console.log('   ✅ Los datos están en la versión correcta');
    console.log('\n📊 Resumen de datos:');
    console.log(`   - Profesores: ${datosEncontrados.teachers.length}`);
    console.log(`   - Grupos: ${datosEncontrados.groups.length}`);
    console.log(`   - Alumnos: ${datosEncontrados.students.length}`);
    console.log(`   - Asignaturas: ${datosEncontrados.subjects.length}`);
    console.log(`   - Programaciones: ${datosEncontrados.programaciones.length}`);
    console.log(`   - SA: ${datosEncontrados.sas.length}`);
    console.log(`   - Unidades: ${datosEncontrados.units?.length || 0}`);
    console.log(`   - Instrumentos: ${datosEncontrados.instruments?.length || 0}`);
    console.log(`   - Calificaciones: ${datosEncontrados.grades?.length || 0}`);
    
    console.log('\n💡 Si los datos no aparecen en la aplicación:');
    console.log('   1. Recarga la página (Ctrl + Shift + R)');
    console.log('   2. Verifica que estás en la versión correcta');
    console.log('   3. Revisa la consola para ver errores');
  }
}

// Ejecutar recuperación
recuperarDatos();
