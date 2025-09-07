#!/bin/bash

echo "🔥 Verificando configuración de Firebase..."

# Verificar archivos de configuración
echo ""
echo "📁 Verificando archivos de configuración:"

if [ -f "ios/FireBase04/GoogleService-Info.plist" ]; then
    echo "✅ GoogleService-Info.plist encontrado en iOS"
else
    echo "❌ GoogleService-Info.plist NO encontrado en iOS"
fi

if [ -f "android/app/google-services.json" ]; then
    echo "✅ google-services.json encontrado en Android"
else
    echo "❌ google-services.json NO encontrado en Android"
fi

# Verificar contenido del plist
echo ""
echo "📋 Verificando contenido de GoogleService-Info.plist:"
if [ -f "ios/FireBase04/GoogleService-Info.plist" ]; then
    PROJECT_ID=$(plutil -extract PROJECT_ID raw ios/FireBase04/GoogleService-Info.plist 2>/dev/null)
    BUNDLE_ID=$(plutil -extract BUNDLE_ID raw ios/FireBase04/GoogleService-Info.plist 2>/dev/null)
    
    if [ ! -z "$PROJECT_ID" ]; then
        echo "✅ PROJECT_ID: $PROJECT_ID"
    else
        echo "❌ PROJECT_ID no encontrado"
    fi
    
    if [ ! -z "$BUNDLE_ID" ]; then
        echo "✅ BUNDLE_ID: $BUNDLE_ID"
    else
        echo "❌ BUNDLE_ID no encontrado"
    fi
fi

# Verificar imports en AppDelegate
echo ""
echo "🏗️ Verificando AppDelegate.swift:"
if grep -q "import Firebase" ios/FireBase04/AppDelegate.swift; then
    echo "✅ import Firebase encontrado"
else
    echo "❌ import Firebase NO encontrado"
fi

if grep -q "FirebaseApp.configure()" ios/FireBase04/AppDelegate.swift; then
    echo "✅ FirebaseApp.configure() encontrado"
else
    echo "❌ FirebaseApp.configure() NO encontrado"
fi

# Verificar packages
echo ""
echo "📦 Verificando packages instalados:"
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

echo ""
echo "🎯 Verificación completa. Si hay ❌, revisa la configuración."
echo ""
