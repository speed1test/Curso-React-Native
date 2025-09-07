# Configuración de Cloud Firestore - Instrucciones Paso a Paso

## 📋 Lista de verificación

### ✅ Completado:
- [x] Proyecto Firebase creado (chele-10376)
- [x] SDK de Firebase instalado en React Native
- [x] Autenticación anónima configurada
- [x] App compilando y ejecutándose correctamente

### 🔧 Pendiente de configurar:

#### 1. Crear base de datos de Cloud Firestore

1. **Ir a Firebase Console**: https://console.firebase.google.com/
2. **Seleccionar proyecto**: "chele-10376"
3. **Navegar a Firestore**:
   - En el menú lateral izquierdo, expandir "Compilación" (Build)
   - Hacer clic en "Firestore Database"
4. **Crear base de datos**:
   - Hacer clic en "Crear base de datos"
   - Seleccionar ubicación (recomendado: us-central1 o southamerica-east1)
   - **IMPORTANTE**: Seleccionar "Modo de prueba" para empezar

#### 2. Configurar reglas de seguridad iniciales

En la pestaña "Reglas" de Firestore, usar estas reglas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite lectura y escritura a usuarios autenticados
    match /users/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /notes/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### 3. Habilitar autenticación anónima

1. **Ir a Authentication**:
   - En el menú lateral, hacer clic en "Authentication"
   - Ir a la pestaña "Sign-in method"
2. **Habilitar Anonymous**:
   - Buscar "Anónimo" en la lista
   - Hacer clic en "Habilitar"
   - Guardar cambios

## 🚀 Funcionalidades de la app

### Autenticación
- **Autenticación anónima**: Los usuarios pueden acceder sin crear cuenta
- **Estado de autenticación**: Se mantiene entre sesiones de la app

### Cloud Firestore - Colección 'users'
- **Crear usuarios**: Agregar usuarios con nombre, apellido, año de nacimiento
- **Lectura en tiempo real**: Los cambios se reflejan automáticamente
- **Eliminación**: Borrar usuarios de la base de datos

### Cloud Firestore - Colección 'notes' 
- **Notas personales**: Cada usuario solo ve sus propias notas
- **CRUD completo**: Crear, leer, actualizar, eliminar notas
- **Tiempo real**: Sincronización automática entre dispositivos
- **Seguridad**: Las notas están asociadas al UID del usuario

## 🔍 Cómo probar la app

### 1. Autenticación
1. Abrir la app
2. Presionar "Autenticación Anónima"
3. Verificar que aparece el UID del usuario

### 2. Crear usuarios
1. Llenar el formulario de usuario:
   - Nombre: "Ada"
   - Apellido: "Lovelace" 
   - Año: "1815"
2. Presionar "Agregar Usuario"
3. Verificar que aparece en la lista

### 3. Crear notas
1. Llenar el formulario de nota:
   - Título: "Mi primera nota"
   - Contenido: "Esta es una prueba de Firestore"
2. Presionar "Agregar Nota"
3. Verificar que aparece en "Mis Notas"

### 4. Verificar datos en Firebase Console
1. Ir a Firestore Database en la consola
2. Verificar que aparecen las colecciones "users" y "notes"
3. Revisar los documentos creados

## 📊 Estructura de datos

### Usuarios (users):
```json
{
  "first": "Ada",
  "last": "Lovelace", 
  "middle": "King",        // Opcional
  "born": 1815,
  "email": "ada@test.com", // Opcional
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Notas (notes):
```json
{
  "title": "Mi nota",
  "content": "Contenido de la nota",
  "userId": "abc123def456",  // UID del usuario
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🛡️ Seguridad implementada

### Reglas de Firestore:
- Solo usuarios autenticados pueden acceder a los datos
- Las notas son privadas por usuario (userId field)
- Validación de estructura de datos

### En el código:
- Manejo de errores completo
- Validación de formularios
- Estados de carga para UX

## 🐛 Debugging

### Para ver logs de Firestore:
```javascript
// En el código, verificar errores:
console.log('Firestore error:', error);

// Verificar usuario actual:
console.log('Current user:', auth().currentUser?.uid);
```

### En Firebase Console:
- Ir a "Firestore Database" > "Usage" para ver estadísticas
- Revisar "Debug" tab para errores de reglas de seguridad

## 🎯 Próximos pasos opcionales

1. **Cloud Storage**: Agregar subida de imágenes a las notas
2. **Cloud Functions**: Procesar datos en el servidor
3. **FCM**: Notificaciones push
4. **Offline Persistence**: Funcionalidad sin conexión
5. **Queries avanzados**: Filtros y ordenamiento complejo

---

**¡La app está lista para probar Cloud Firestore!** 🎉

Solo falta configurar la base de datos en Firebase Console siguiendo los pasos de arriba.
