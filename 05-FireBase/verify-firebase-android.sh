#!/bin/bash

echo "🔍 Verificando configuración de Firebase para Android..."
echo "=================================================="

# Verificar si existe google-services.json
if [ -f "android/app/google-services.json" ]; then
    echo "✅ google-services.json encontrado en android/app/"
    
    # Verificar contenido básico
    if grep -q "project_id" android/app/google-services.json; then
        PROJECT_ID=$(grep -o '"project_id": "[^"]*"' android/app/google-services.json | cut -d'"' -f4)
        echo "   📋 Project ID: $PROJECT_ID"
    fi
    
    if grep -q "package_name" android/app/google-services.json; then
        PACKAGE_NAME=$(grep -o '"package_name": "[^"]*"' android/app/google-services.json | cut -d'"' -f4)
        echo "   📦 Package Name: $PACKAGE_NAME"
    fi
else
    echo "❌ google-services.json NO encontrado en android/app/"
    echo "   📥 Debes descargarlo desde Firebase Console"
fi

# Verificar build.gradle del proyecto
echo ""
echo "🔧 Verificando configuración de Gradle..."
if grep -q "google-services" android/build.gradle; then
    echo "✅ Plugin google-services configurado en build.gradle del proyecto"
else
    echo "❌ Plugin google-services NO configurado en build.gradle del proyecto"
fi

# Verificar build.gradle de la app
if grep -q "google-services" android/app/build.gradle; then
    echo "✅ Plugin google-services aplicado en build.gradle de la app"
else
    echo "❌ Plugin google-services NO aplicado en build.gradle de la app"
fi

# Verificar MainApplication.kt
echo ""
echo "📱 Verificando MainApplication.kt..."
if grep -q "ReactNativeFirebaseAppPackage" android/app/src/main/java/com/firebase04/MainApplication.kt; then
    echo "✅ ReactNativeFirebaseAppPackage configurado en MainApplication.kt"
else
    echo "❌ ReactNativeFirebaseAppPackage NO configurado en MainApplication.kt"
fi

# Verificar permisos en AndroidManifest.xml
echo ""
echo "🔐 Verificando permisos en AndroidManifest.xml..."
MANIFEST_FILE="android/app/src/main/AndroidManifest.xml"

if grep -q "android.permission.INTERNET" $MANIFEST_FILE; then
    echo "✅ Permiso INTERNET configurado"
else
    echo "❌ Permiso INTERNET NO configurado"
fi

if grep -q "android.permission.ACCESS_NETWORK_STATE" $MANIFEST_FILE; then
    echo "✅ Permiso ACCESS_NETWORK_STATE configurado"
else
    echo "❌ Permiso ACCESS_NETWORK_STATE NO configurado"
fi

# Verificar dependencias de React Native Firebase
echo ""
echo "📦 Verificando dependencias de React Native Firebase..."
if grep -q "@react-native-firebase/app" package.json; then
    echo "✅ @react-native-firebase/app instalado"
else
    echo "❌ @react-native-firebase/app NO instalado"
fi

if grep -q "@react-native-firebase/auth" package.json; then
    echo "✅ @react-native-firebase/auth instalado"
else
    echo "❌ @react-native-firebase/auth NO instalado"
fi

if grep -q "@react-native-firebase/firestore" package.json; then
    echo "✅ @react-native-firebase/firestore instalado"
else
    echo "❌ @react-native-firebase/firestore NO instalado"
fi

if grep -q "@react-native-firebase/storage" package.json; then
    echo "✅ @react-native-firebase/storage instalado"
else
    echo "❌ @react-native-firebase/storage NO instalado"
fi

echo ""
echo "🚀 Para construir la app Android con Firebase:"
echo "   npx react-native run-android"
echo ""
echo "📋 Pasos adicionales si hay problemas:"
echo "   1. cd android && ./gradlew clean"
echo "   2. cd .. && npx react-native run-android"
echo "   3. Si persisten errores, revisa que el google-services.json sea válido"
echo ""
