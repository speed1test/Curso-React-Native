# Cloud Firestore Security Rules

## Configuración de reglas de seguridad para la app Firebase

### Reglas actuales recomendadas

Para configurar las reglas de seguridad en Firebase Console:

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto "chele-10376"
3. En el menú lateral, ve a "Firestore Database"
4. Haz clic en la pestaña "Reglas"
5. Reemplaza las reglas existentes con las siguientes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección 'users'
    // Permite lectura a todos los usuarios autenticados
    // Permite escritura solo a usuarios autenticados
    match /users/{document} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Reglas para la colección 'notes'
    // Solo permite acceso a las notas del usuario autenticado
    match /notes/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Denegar acceso a cualquier otra colección no especificada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Modo de prueba (temporal)

Si necesitas comenzar rápidamente sin restricciones de seguridad (solo para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

⚠️ **IMPORTANTE**: Las reglas en modo de prueba son temporales y permitirán acceso total hasta la fecha especificada. Cambia a reglas de producción antes de que expire.

### Reglas de producción (más seguras)

Para un entorno de producción con mayor seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función auxiliar para verificar propiedad
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Colección de usuarios
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && isOwner(userId)
        && isValidUser(request.resource.data);
      allow update: if isAuthenticated() 
        && isOwner(userId)
        && isValidUser(request.resource.data);
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Colección de notas
    match /notes/{noteId} {
      allow read, write: if isAuthenticated() 
        && isOwner(resource.data.userId);
      allow create: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && isValidNote(request.resource.data);
    }
    
    // Validación de datos de usuario
    function isValidUser(userData) {
      return userData.keys().hasAll(['first', 'last', 'born', 'createdAt'])
        && userData.first is string
        && userData.last is string
        && userData.born is number
        && userData.born > 1900
        && userData.born < 2024;
    }
    
    // Validación de datos de nota
    function isValidNote(noteData) {
      return noteData.keys().hasAll(['title', 'content', 'userId', 'createdAt', 'updatedAt'])
        && noteData.title is string
        && noteData.content is string
        && noteData.userId is string
        && noteData.title.size() > 0
        && noteData.content.size() > 0;
    }
  }
}
```

## Configuración de autenticación

Para habilitar la autenticación anónima:

1. En Firebase Console, ve a "Authentication"
2. Haz clic en "Sign-in method"
3. Habilita "Anonymous"
4. Guarda los cambios

## Estructura de datos

### Colección 'users'
```json
{
  "first": "string",      // Obligatorio
  "last": "string",       // Obligatorio  
  "middle": "string",     // Opcional
  "born": "number",       // Obligatorio
  "email": "string",      // Opcional
  "createdAt": "timestamp" // Automático
}
```

### Colección 'notes'
```json
{
  "title": "string",      // Obligatorio
  "content": "string",    // Obligatorio
  "userId": "string",     // Obligatorio (UID del usuario)
  "createdAt": "timestamp", // Automático
  "updatedAt": "timestamp"  // Automático
}
```

## Monitoreo y depuración

### Para monitorear las operaciones de Firestore:

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en la pestaña "Usage"
3. Revisa las métricas de lectura/escritura

### Para depurar errores de reglas de seguridad:

1. Ve a la pestaña "Reglas"
2. Usa el simulador de reglas
3. Revisa los logs en "Firestore Debug"

### Comandos útiles para debugging:

```javascript
// En el código de la app, para ver errores de permisos:
console.log('Firestore error:', error.code, error.message);

// Para verificar el usuario actual:
console.log('Current user:', auth().currentUser?.uid);
```
