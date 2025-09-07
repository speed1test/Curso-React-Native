# Firebase React Native Example 🔥

Una aplicación completa de React Native que demuestra la integración con Firebase, incluyendo autenticación y Cloud Firestore.

## 🚀 Características

### ✅ Firebase Authentication
- Autenticación anónima
- Gestión de estado de usuario
- Persistencia de sesión

### ✅ Cloud Firestore
- Base de datos en tiempo real
- Operaciones CRUD completas
- Reglas de seguridad
- Listeners en tiempo real
- Datos estructurados

### ✅ Interfaz de Usuario
- Diseño nativo iOS/Android
- Indicadores de carga
- Manejo de errores
- Formularios validados

## 📋 Requisitos previos

- Node.js 16+
- React Native CLI
- Xcode (para iOS)
- Android Studio (para Android)
- Cuenta de Firebase

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install

# iOS - Instalar pods
cd ios && pod install && cd ..
```

### 2. Configuración de Firebase

#### Firebase Console:
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Agregar app iOS y Android
3. Descargar archivos de configuración:
   - `GoogleService-Info.plist` (iOS) → `ios/FireBase04/`
   - `google-services.json` (Android) → `android/app/`

#### Habilitar servicios:
- **Authentication**: Método anónimo
- **Firestore Database**: Modo de prueba

### 3. Ejecutar la aplicación

```bash
# iOS
npm run ios
# o
npx react-native run-ios

# Android  
npm run android
# o
npx react-native run-android
```

## 📱 Funcionalidades de la App

### 🔐 Autenticación
- **Inicio de sesión anónimo**: Sin necesidad de email/password
- **Estado persistente**: La sesión se mantiene entre reinicios
- **Gestión de usuario**: UID único para cada sesión

### 👥 Gestión de Usuarios (Colección 'users')
- **Crear usuario**: Nombre, apellido, año de nacimiento
- **Lista en tiempo real**: Actualización automática
- **Eliminación**: Borrar usuarios de Firestore
- **Validación**: Campos obligatorios y tipos de datos

### 📝 Notas Personales (Colección 'notes')
- **Notas privadas**: Solo el usuario ve sus notas
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Tiempo real**: Sincronización instantánea
- **Asociación segura**: Vinculadas al UID del usuario

## 🏗️ Arquitectura

### Estructura de carpetas
```
src/
├── components/
│   ├── FirestoreExample.tsx    # Componente principal
│   ├── FirebaseSimpleTest.tsx  # Testing básico  
│   └── NotesApp.tsx           # App de notas anterior
├── types/                     # Tipos TypeScript
└── utils/                     # Utilidades
```

### Tecnologías utilizadas
- **React Native 0.74+**: Framework móvil
- **TypeScript**: Tipado estático
- **Firebase SDK**: 
  - `@react-native-firebase/app`: Core
  - `@react-native-firebase/auth`: Autenticación
  - `@react-native-firebase/firestore`: Base de datos
- **React Hooks**: Estado y efectos
- **SafeAreaView**: Diseño seguro

## 📊 Estructura de Datos

### Usuarios (Colección: `users`)
```typescript
interface User {
  id: string;           // Document ID
  first: string;        // Nombre (obligatorio)
  last: string;         // Apellido (obligatorio)
  middle?: string;      // Segundo nombre (opcional)
  born: number;         // Año nacimiento (obligatorio)
  email?: string;       // Email (opcional)
  createdAt: Timestamp; // Fecha creación
}
```

### Notas (Colección: `notes`)
```typescript
interface Note {
  id: string;           // Document ID
  title: string;        // Título (obligatorio)
  content: string;      // Contenido (obligatorio)
  userId: string;       // UID propietario (obligatorio)
  createdAt: Timestamp; // Fecha creación
  updatedAt: Timestamp; // Última modificación
}
```

## 🛡️ Seguridad

### Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: Lectura pública, escritura autenticada
    match /users/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Notas: Solo el propietario puede acceder
    match /notes/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Validaciones en código
- Campos obligatorios
- Tipos de datos correctos
- Manejo de errores completo
- Estados de carga

## 🔧 Configuración avanzada

### Variables de entorno
```bash
# .env (opcional)
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_API_KEY=tu-api-key
```

### Reglas de producción
Ver: `docs/firestore-security-rules.md`

### Monitoring
- Firebase Console > Firestore > Usage
- Logs de rendimiento
- Alertas de seguridad

## 🐛 Troubleshooting

### Problemas comunes

#### Error: "No Firebase App '[DEFAULT]' has been created"
```bash
# Verificar configuración en AppDelegate.swift
# Asegurar que Firebase.configure() está presente
```

#### Error de compilación iOS
```bash
# Limpiar cache y reinstalar pods
cd ios && rm -rf Pods Podfile.lock && pod install
```

#### Error de permisos Firestore
```bash
# Verificar reglas de seguridad en Firebase Console
# Asegurar que Authentication está habilitado
```

### Logs útiles
```javascript
// Ver errores de Firestore
console.log('Error:', error.code, error.message);

// Verificar usuario actual  
console.log('User:', auth().currentUser?.uid);

// Estado de conexión
console.log('App state:', firebase.app().options);
```

## 📚 Documentación adicional

- [Guía de configuración de Firestore](./docs/firestore-setup-guide.md)
- [Reglas de seguridad](./docs/firestore-security-rules.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)

## 🤝 Contribuir

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🎯 Próximos pasos

- [ ] Cloud Storage para imágenes
- [ ] Cloud Functions para lógica de servidor  
- [ ] Push notifications con FCM
- [ ] Modo offline con persistencia
- [ ] Tests unitarios e integración
- [ ] CI/CD con GitHub Actions

---

**¡Desarrollado con ❤️ usando React Native y Firebase!**

Para soporte, abrir un issue en GitHub o contactar al equipo de desarrollo.
