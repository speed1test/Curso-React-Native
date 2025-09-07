# 🔧 Reglas de Firestore Corregidas - Para Desarrollo

## ⚠️ **Problema identificado:**
Las reglas actuales no permiten eliminar usuarios de la colección global porque están diseñadas para que cada usuario solo elimine sus propios documentos.

## 🔄 **Solución temporal para desarrollo:**

Copia estas reglas en Firebase Console > Firestore > Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función auxiliar para verificar propiedad de documento
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Colección 'users' - MÁS PERMISIVA PARA DESARROLLO
    match /users/{userId} {
      // Cualquier usuario autenticado puede leer
      allow read: if isAuthenticated();
      
      // Cualquier usuario autenticado puede crear
      allow create: if isAuthenticated() 
        && isValidUserData(request.resource.data);
      
      // Cualquier usuario autenticado puede actualizar
      allow update: if isAuthenticated() 
        && isValidUserData(request.resource.data);
      
      // ✅ CUALQUIER usuario autenticado puede eliminar usuarios
      allow delete: if isAuthenticated();
    }
    
    // Colección 'notes' - Solo el propietario puede acceder
    match /notes/{noteId} {
      allow read: if isAuthenticated() 
        && isOwner(resource.data.userId);
      
      allow create: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && isValidNoteData(request.resource.data);
      
      allow update: if isAuthenticated() 
        && isOwner(resource.data.userId)
        && isOwner(request.resource.data.userId)
        && isValidNoteData(request.resource.data);
      
      allow delete: if isAuthenticated() 
        && isOwner(resource.data.userId);
    }
    
    // Validación de datos de usuario (flexible)
    function isValidUserData(userData) {
      let requiredFields = ['createdAt'];
      let hasRequiredFields = userData.keys().hasAll(requiredFields);
      
      let validFirst = !('first' in userData.keys()) || 
                      (userData.first is string && userData.first.size() > 0);
      let validLast = !('last' in userData.keys()) || 
                     (userData.last is string && userData.last.size() > 0);
      let validBorn = !('born' in userData.keys()) || 
                     (userData.born is number && userData.born > 1800 && userData.born <= 2025);
      
      return hasRequiredFields && validFirst && validLast && validBorn;
    }
    
    // Validación de datos de nota (flexible)
    function isValidNoteData(noteData) {
      let requiredFields = ['userId', 'createdAt'];
      let hasRequiredFields = noteData.keys().hasAll(requiredFields);
      
      let validUserId = noteData.userId is string && noteData.userId.size() > 0;
      let validTitle = !('title' in noteData.keys()) || 
                      (noteData.title is string);
      let validContent = !('content' in noteData.keys()) || 
                        (noteData.content is string);
      
      return hasRequiredFields && validUserId && validTitle && validContent;
    }
    
    // Colección de prueba para desarrollo
    match /test/{document=**} {
      allow read, write: if isAuthenticated();
    }
    
    // Denegar acceso a cualquier otra colección
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🔄 **Reglas alternativa SUPER permisiva (solo para debugging):**

Si la anterior no funciona, usa esta temporalmente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## ⚠️ **IMPORTANTE:**
- Estas reglas son para desarrollo
- En producción, usuarios no deberían poder eliminar datos de otros
- Una vez que funcione, podemos implementar reglas más seguras

## 🔄 **Pasos para aplicar:**
1. Ve a Firebase Console: https://console.firebase.google.com/project/chele-10376/firestore
2. Pestaña "Reglas"
3. Copia y pega las reglas de arriba
4. Presiona "Publicar"
5. Prueba la app de nuevo

---

**Una vez que funcione la eliminación, te ayudo a implementar un sistema más seguro.**
