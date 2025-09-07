# Firebase React Native Example

Este proyecto demuestra cómo integrar Firebase con React Native usando las siguientes funcionalidades:

- 🔐 **Firebase Authentication** - Registro e inicio de sesión de usuarios
- 📄 **Cloud Firestore** - Base de datos NoSQL para almacenar notas
- 📱 **Interfaz completa** - Pantallas de autenticación y gestión de notas

## ✨ Funcionalidades del Ejemplo

- **Autenticación de usuarios** con email y contraseña
- **Registro de nuevos usuarios**
- **Gestión de notas** en tiempo real
- **Sincronización automática** entre dispositivos
- **Interfaz moderna** y fácil de usar

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

Las dependencias de Firebase ya están instaladas en el proyecto:

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
```

### 2. Configurar Firebase Console

#### 2.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear un proyecto" o selecciona uno existente
3. Completa la configuración del proyecto

#### 2.2 Habilitar Servicios Necesarios

**Authentication:**
1. En Firebase Console, ve a "Authentication" → "Sign-in method"
2. Habilita "Email/Password"

**Firestore Database:**
1. Ve a "Firestore Database" → "Crear base de datos"
2. Selecciona modo de prueba (para desarrollo)
3. Elige una región cercana

### 3. Configuración para Android

#### 3.1 Registrar App Android

1. En Firebase Console, haz clic en "Agregar app" → Android
2. **Package name:** `com.firebase04` (debe coincidir exactamente)
3. **App nickname:** FireBase04 (opcional)
4. **SHA-1:** Opcional para development

#### 3.2 Descargar google-services.json

1. Descarga el archivo `google-services.json`
2. Colócalo en: `android/app/google-services.json`
3. ⚠️ **IMPORTANTE:** Reemplaza el archivo de ejemplo que está en el proyecto

#### 3.3 Verificar Configuración Android

Los archivos de configuración ya están listos:

- ✅ `android/build.gradle` - Plugin de Google Services agregado
- ✅ `android/app/build.gradle` - Plugin aplicado
- ✅ Dependencias de Firebase configuradas

### 4. Configuración para iOS

#### 4.1 Registrar App iOS

1. En Firebase Console, haz clic en "Agregar app" → iOS
2. **Bundle ID:** `org.reactjs.native.example.FireBase04`
3. **App nickname:** FireBase04 (opcional)

#### 4.2 Descargar GoogleService-Info.plist

1. Descarga el archivo `GoogleService-Info.plist`
2. Colócalo en: `ios/FireBase04/GoogleService-Info.plist`
3. ⚠️ **IMPORTANTE:** Reemplaza el archivo de ejemplo

#### 4.3 Agregar archivo a Xcode

1. Abre `ios/FireBase04.xcworkspace` en Xcode (NO uses .xcodeproj)
2. Arrastra `GoogleService-Info.plist` al proyecto en Xcode
3. Asegúrate de que esté marcado para el target "FireBase04"

#### 4.4 Verificar Configuración iOS

- ✅ Podfile actualizado con `use_modular_headers!`
- ✅ Pods de Firebase instalados
- ✅ Configuración lista para usar

## 🏃‍♂️ Ejecutar el Proyecto

### Modo Desarrollo

```bash
# Terminal 1: Iniciar Metro bundler
npm start

# Terminal 2: Ejecutar en Android
npm run android

# Terminal 3: Ejecutar en iOS  
npm run ios
```

### Verificar Instalación

Si todo está configurado correctamente:

1. **La app debería iniciarse sin errores**
2. **Verás la pantalla de login**
3. **Podrás registrar un nuevo usuario**
4. **Podrás crear y ver notas en tiempo real**

## 📱 Cómo Usar la App

### Registro/Login
1. Ingresa un email válido
2. Ingresa una contraseña (mínimo 6 caracteres)
3. Haz clic en "Registrarse" para crear una cuenta nueva
4. O "Iniciar Sesión" si ya tienes cuenta

### Gestión de Notas
1. Una vez autenticado, verás el formulario para agregar notas
2. Ingresa un título y contenido
3. Haz clic en "Agregar Nota"
4. Tus notas aparecerán listadas debajo
5. Puedes eliminar notas haciendo clic en "Eliminar"

## 🔧 Troubleshooting

### Error: "No Firebase App '[DEFAULT]' has been created"

**Solución:**
- Verifica que `google-services.json` esté en `android/app/`
- Verifica que `GoogleService-Info.plist` esté en `ios/FireBase04/`
- Asegúrate de que los archivos no sean de ejemplo sino los reales de Firebase Console

### Error: "Task :app:processDebugGoogleServices FAILED"

**Solución:**
- Verifica que el package name en `google-services.json` sea exactamente `com.firebase04`
- Limpia el proyecto: `cd android && ./gradlew clean`

### Error: "Auth domain is not configured"

**Solución:**
- Ve a Firebase Console → Authentication → Settings
- Agrega tu dominio si es necesario (usualmente no requerido para desarrollo)

### Error en iOS: "Firebase not found"

**Solución:**
- Ejecuta `cd ios && pod install` nuevamente
- Asegúrate de abrir `.xcworkspace` y no `.xcodeproj`
- Verifica que `GoogleService-Info.plist` esté agregado al target en Xcode

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── firebase.ts          # Configuración de Firebase
└── components/
    └── FirebaseExample.tsx   # Componente principal con toda la funcionalidad
```

## 🔐 Reglas de Seguridad Recomendadas

Para Firestore (Firebase Console → Firestore → Reglas):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden acceder a sus propias notas
    match /notes/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎯 Próximos Pasos

Este ejemplo incluye las funcionalidades básicas. Puedes extenderlo agregando:

- 📷 **Firebase Storage** - Para subir imágenes
- 🔔 **Cloud Messaging** - Para notificaciones push
- 📊 **Analytics** - Para métricas de uso
- 🌙 **Modo offline** - Con persistencia local
- 👥 **Funciones en la nube** - Para lógica del servidor

## 🆘 Soporte

Si tienes problemas:

1. Revisa la [documentación oficial de React Native Firebase](https://rnfirebase.io/)
2. Verifica que todas las configuraciones coincidan exactamente
3. Asegúrate de usar los archivos de configuración correctos (no los de ejemplo)

---

¡Disfruta desarrollando con Firebase! 🔥📱
