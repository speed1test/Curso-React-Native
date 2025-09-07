#!/bin/bash

# Scripts útiles para desarrollo con Firebase

echo "🔥 Firebase React Native - Scripts de Desarrollo"
echo "=============================================="

# Función para limpiar y reinstalar dependencias
clean_install() {
    echo "🧹 Limpiando proyecto..."
    rm -rf node_modules
    rm -rf ios/Pods
    rm -rf ios/Podfile.lock
    rm -rf android/build
    rm -rf android/app/build
    
    echo "📦 Instalando dependencias..."
    npm install
    
    echo "🍎 Instalando pods de iOS..."
    cd ios && pod install && cd ..
    
    echo "✅ Limpieza completada!"
}

# Función para verificar configuración de Firebase
check_firebase_config() {
    echo "🔍 Verificando configuración de Firebase..."
    
    # Verificar Android
    if [ -f "android/app/google-services.json" ]; then
        echo "✅ google-services.json encontrado"
    else
        echo "❌ google-services.json NO encontrado en android/app/"
        echo "   Descárgalo desde Firebase Console y colócalo en android/app/"
    fi
    
    # Verificar iOS
    if [ -f "ios/FireBase04/GoogleService-Info.plist" ]; then
        echo "✅ GoogleService-Info.plist encontrado"
    else
        echo "❌ GoogleService-Info.plist NO encontrado en ios/FireBase04/"
        echo "   Descárgalo desde Firebase Console y colócalo en ios/FireBase04/"
    fi
    
    # Verificar que no sean archivos de ejemplo
    if grep -q "tu-proyecto-firebase" android/app/google-services.json 2>/dev/null; then
        echo "⚠️  google-services.json parece ser un archivo de ejemplo"
        echo "   Reemplázalo con el archivo real de Firebase Console"
    fi
    
    if grep -q "tu-proyecto-firebase" ios/FireBase04/GoogleService-Info.plist 2>/dev/null; then
        echo "⚠️  GoogleService-Info.plist parece ser un archivo de ejemplo"
        echo "   Reemplázalo con el archivo real de Firebase Console"
    fi
}

# Función para mostrar logs de desarrollo
show_logs() {
    echo "📱 Mostrando logs..."
    echo "Para Android: adb logcat | grep -E '(ReactNativeJS|Firebase)'"
    echo "Para iOS: Abrir Xcode y ver la consola"
}

# Función para ejecutar el proyecto
run_project() {
    platform=$1
    
    if [ "$platform" = "android" ]; then
        echo "🤖 Ejecutando en Android..."
        npm run android
    elif [ "$platform" = "ios" ]; then
        echo "🍎 Ejecutando en iOS..."
        npm run ios
    else
        echo "📱 Iniciando Metro bundler..."
        npm start
    fi
}

# Menu principal
case "$1" in
    "clean")
        clean_install
        ;;
    "check")
        check_firebase_config
        ;;
    "logs")
        show_logs
        ;;
    "android")
        run_project "android"
        ;;
    "ios")
        run_project "ios"
        ;;
    "start")
        run_project "start"
        ;;
    *)
        echo "Uso: $0 {clean|check|logs|android|ios|start}"
        echo ""
        echo "Comandos disponibles:"
        echo "  clean   - Limpiar e instalar dependencias"
        echo "  check   - Verificar configuración de Firebase"
        echo "  logs    - Mostrar información sobre logs"
        echo "  android - Ejecutar en Android"
        echo "  ios     - Ejecutar en iOS"
        echo "  start   - Iniciar Metro bundler"
        echo ""
        echo "Ejemplos:"
        echo "  ./dev-scripts.sh clean"
        echo "  ./dev-scripts.sh check"
        echo "  ./dev-scripts.sh android"
        ;;
esac
