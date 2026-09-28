@echo off
echo ========================================
echo   TRAZO - Compilador para Windows
echo ========================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js instalado
echo.

REM Instalar dependencias
echo [2/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)
echo OK: Dependencias instaladas
echo.

REM Compilar aplicacion web
echo [3/4] Compilando aplicacion web...
call npm run build
if errorlevel 1 (
    echo ERROR: Fallo al compilar la aplicacion web
    pause
    exit /b 1
)
echo OK: Aplicacion web compilada
echo.

REM Compilar para Windows
echo [4/4] Compilando para Windows...
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Fallo al compilar para Windows
    pause
    exit /b 1
)
echo OK: Aplicacion compilada para Windows
echo.

echo ========================================
echo   COMPILACION COMPLETADA
echo ========================================
echo.
echo Los instaladores estan en la carpeta: release\
echo.
echo Archivos generados:
dir /b release\*.exe 2>nul
echo.
pause
