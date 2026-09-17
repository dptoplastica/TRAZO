@echo off
echo ========================================
echo   Compilando TRAZO para Windows
echo ========================================
echo.

echo [1/2] Compilando aplicacion web...
call npm run build
if errorlevel 1 (
    echo Error en la compilacion web
    pause
    exit /b 1
)
echo.

echo [2/2] Creando ejecutable...
call npx electron-builder --win
if errorlevel 1 (
    echo Error al crear el ejecutable
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Compilacion completada!
echo ========================================
echo.
echo El ejecutable se encuentra en la carpeta: release
echo.
pause
