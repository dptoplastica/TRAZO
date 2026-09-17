# Script de compilación para TRAZO
# Ejecutar en PowerShell: .\compilar.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TRAZO - Script de Compilación" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Compilar la aplicación web
Write-Host "[1/3] Compilando aplicación web..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en la compilación web" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Aplicación web compilada" -ForegroundColor Green
Write-Host ""

# Paso 2: Crear ejecutable con Electron
Write-Host "[2/3] Creando ejecutable de escritorio..." -ForegroundColor Yellow
npx electron-builder --win --config electron-builder.json
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en la creación del ejecutable" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Ejecutable creado" -ForegroundColor Green
Write-Host ""

# Paso 3: Mostrar resultado
Write-Host "[3/3] Proceso completado" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ¡Compilación exitosa!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "El ejecutable se encuentra en:" -ForegroundColor Cyan
Write-Host "  release\TRAZO Setup X.X.X.exe" -ForegroundColor White
Write-Host ""
Write-Host "También puedes encontrar:" -ForegroundColor Cyan
Write-Host "  • Versión web: dist\index.html" -ForegroundColor White
Write-Host "  • Versión portable: release\TRAZO X.X.X.exe" -ForegroundColor White
Write-Host ""
