// Este archivo se usa para verificar que el código se está cargando correctamente
export const APP_VERSION = "2.0.0";
export const BUILD_TIMESTAMP = new Date().toISOString();

console.log(`%c[TRAZO] Versión ${APP_VERSION} - Build: ${BUILD_TIMESTAMP}`, 
  'color: #0e7c66; font-weight: bold; font-size: 14px;');
