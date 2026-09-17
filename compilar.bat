@echo off
echo ========================================
echo   TRAZO - Script de Compilación
echo ========================================
echo.

echo [1/3] Compilando aplicación web...
call npm run build
if errorlevel 1 (
    echo Error en la compilación web
    pause
    exit /b 1
)
echo ✓ Aplicación web compilada
echo.

echo [2/3] Creando ejecutable de escritorio...
call npx electron-builder --win --config electron-builder.json
if errorlevel 1 (
    echo Error en la creación del ejecutable
    pause
    exit /b 1
)
echo ✓ Ejecutable creado
echo.

echo [3/3] Proceso completado
echo.
echo ========================================
echo   ¡Compilación exitosa!
echo ========================================
echo.
echo El ejecutable se encuentra en:
echo   release\TRAZO Setup X.X.X.exe
echo.
echo También puedes encontrar:
echo   • Versión web: dist\index.html
echo   • Versión portable: release\TRAZO X.X.X.exe
echo.
pause
