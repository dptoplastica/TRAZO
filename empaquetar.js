#!/usr/bin/env node

/**
 * Script para empaquetar el proyecto TRAZO en un archivo ZIP
 * Ejecutar con: node empaquetar.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Verificar si JSZip está instalado
try {
  require('jszip');
} catch (e) {
  console.log('📦 Instalando dependencias necesarias...');
  execSync('npm install --no-save jszip', { stdio: 'inherit' });
}

const JSZip = require('jszip');

// Archivos y carpetas a incluir
const INCLUDE_PATTERNS = [
  'src/**/*',
  'public/**/*',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'tsconfig.json',
  'tsconfig.node.json',
  'index.html',
  'README.md',
  'INSTALACION_LOCAL.md',
  'CONFIGURACION_SUPABASE.md',
  'SUPABASE_SCHEMA.sql',
  '.env.example',
  '.gitignore'
];

// Archivos y carpetas a excluir
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  '.git',
  '*.log',
  '.env.local',
  '.env.*.local'
];

function shouldInclude(filePath) {
  // Excluir patrones
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      if (regex.test(filePath)) return false;
    } else if (filePath.includes(pattern)) {
      return false;
    }
  }
  return true;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (shouldInclude(filePath)) {
      if (stat.isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

async function createZip() {
  console.log('🎨 Empaquetando proyecto TRAZO...\n');

  const zip = new JSZip();
  const rootFolder = zip.folder('trazo-lomloe');
  
  // Obtener todos los archivos
  const allFiles = getAllFiles('.');
  
  console.log(`📁 Encontrados ${allFiles.length} archivos\n`);

  // Agregar archivos al ZIP
  let addedCount = 0;
  allFiles.forEach(file => {
    const relativePath = path.relative('.', file);
    const content = fs.readFileSync(file);
    rootFolder.file(relativePath, content);
    addedCount++;
    
    if (addedCount % 10 === 0) {
      process.stdout.write(`\r⏳ Procesando archivos... ${addedCount}/${allFiles.length}`);
    }
  });

  console.log(`\n✅ ${addedCount} archivos agregados\n`);

  // Generar el ZIP
  console.log('📦 Generando archivo ZIP...');
  const zipContent = await zip.generateAsync({ 
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Guardar el archivo
  const outputFileName = 'trazo-lomloe.zip';
  fs.writeFileSync(outputFileName, zipContent);

  const stats = fs.statSync(outputFileName);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`\n✅ ¡Listo! Archivo creado: ${outputFileName}`);
  console.log(`📊 Tamaño: ${sizeMB} MB\n`);
  console.log('📋 Próximos pasos:');
  console.log('   1. Descomprime el archivo ZIP');
  console.log('   2. Abre una terminal en la carpeta descomprimida');
  console.log('   3. Ejecuta: npm install');
  console.log('   4. Ejecuta: npm run dev');
  console.log('   5. Abre: http://localhost:5173/inicializar.html\n');
}

createZip().catch(err => {
  console.error('❌ Error al crear el ZIP:', err);
  process.exit(1);
});
