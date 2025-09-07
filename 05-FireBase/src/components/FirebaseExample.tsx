import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
}

const FirebaseExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Verificar conexión con Firebase
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        console.log('🔍 Verificando conexión con Firebase...');
        
        // Verificar que Firebase esté configurado
        const app = firebase.app();
        console.log('✅ Firebase App inicializada:', app.name);
        console.log('📋 Project ID:', app.options.projectId);
        
        // Verificar servicios básicos con timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        );
        
        const authPromise = Promise.resolve(auth());
        const firestorePromise = Promise.resolve(firestore());
        
        await Promise.race([
          Promise.all([authPromise, firestorePromise]),
          timeoutPromise
        ]);
        
        console.log('� Auth service disponible');
        console.log('📄 Firestore service disponible');
        
        setFirebaseConnected(true);
        console.log('✅ Firebase conectado correctamente');
        
      } catch (error) {
        console.error('❌ Error conectando con Firebase:', error);
        setFirebaseConnected(false);
        // No mostrar alert inmediatamente para evitar crashes
        console.warn('⚠️ Firebase connection failed, running in offline mode');
      } finally {
        setLoading(false);
      }
    };

    checkFirebaseConnection();
  }, []);

  // Listener para cambios en la autenticación
  useEffect(() => {
    if (!firebaseConnected) {
      setLoading(false);
      return;
    }

    console.log('🔐 Configurando listener de autenticación...');
    
    try {
      const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
        try {
          if (firebaseUser) {
            const userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email || 'Usuario',
            };
            setUser(userData);
            console.log('👤 Usuario autenticado:', userData.email);
          } else {
            setUser(null);
            setNotes([]);
            console.log('👤 Usuario desconectado');
          }
        } catch (error) {
          console.error('❌ Error en auth state change:', error);
        } finally {
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error configurando auth listener:', error);
      setLoading(false);
      return () => {};
    }
  }, [firebaseConnected]);

  // Listener para las notas del usuario
  useEffect(() => {
    if (!user || !firebaseConnected) return;

    console.log('📝 Configurando listener de notas para usuario:', user.email);
    
    const unsubscribe = firestore()
      .collection('notes')
      .where('userId', '==', user.id)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          try {
            const notesData: Note[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              notesData.push({
                id: doc.id,
                title: data.title || '',
                content: data.content || '',
                userId: data.userId || '',
                createdAt: data.createdAt?.toDate() || new Date(),
              });
            });
            setNotes(notesData);
            console.log('📝 Notas actualizadas:', notesData.length);
          } catch (error) {
            console.error('❌ Error procesando notas:', error);
          }
        },
        (error) => {
          console.error('❌ Error escuchando notas:', error);
          // No mostrar alert para errores de permisos iniciales
          if (!error.message.includes('permission')) {
            Alert.alert('Error', 'Error cargando notas: ' + error.message);
          }
        }
      );

    return unsubscribe;
  }, [user, firebaseConnected]);

  // Función para registrar usuario
  const signUp = async () => {
    if (!firebaseConnected) {
      Alert.alert('Error', 'Firebase no está conectado');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      setAuthLoading(true);
      console.log('📝 Registrando usuario:', email);
      
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('❌ Error registrando usuario:', error);
      let errorMessage = 'Error desconocido';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Función para iniciar sesión
  const signIn = async () => {
    if (!firebaseConnected) {
      Alert.alert('Error', 'Firebase no está conectado');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      setAuthLoading(true);
      console.log('🔐 Iniciando sesión:', email);
      
      await auth().signInWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('❌ Error iniciando sesión:', error);
      let errorMessage = 'Error desconocido';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión');
      await auth().signOut();
    } catch (error: any) {
      console.error('❌ Error cerrando sesión:', error);
      Alert.alert('Error', error.message);
    }
  };

  // Función para agregar nota
  const addNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!user || !firebaseConnected) {
      Alert.alert('Error', 'No hay usuario autenticado');
      return;
    }

    try {
      console.log('➕ Agregando nota:', noteTitle);
      
      await firestore().collection('notes').add({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        userId: user.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setNoteTitle('');
      setNoteContent('');
      Alert.alert('Éxito', 'Nota agregada correctamente');
    } catch (error: any) {
      console.error('❌ Error agregando nota:', error);
      Alert.alert('Error', 'Error guardando nota: ' + error.message);
    }
  };

  // Función para eliminar nota
  const deleteNote = async (noteId: string) => {
    try {
      console.log('🗑️ Eliminando nota:', noteId);
      await firestore().collection('notes').doc(noteId).delete();
      Alert.alert('Éxito', 'Nota eliminada correctamente');
    } catch (error: any) {
      console.error('❌ Error eliminando nota:', error);
      Alert.alert('Error', 'Error eliminando nota: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Conectando con Firebase...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🔥 Firebase React Native</Text>
      
      {/* Estado de conexión de Firebase */}
      <View style={styles.connectionStatus}>
        <Text style={firebaseConnected ? styles.connectedText : styles.disconnectedText}>
          {firebaseConnected ? '🟢 Firebase Conectado' : '🔴 Firebase Desconectado'}
        </Text>
        {firebaseConnected && (
          <Text style={styles.projectInfo}>
            📋 Proyecto: {firebase.app().options.projectId}
          </Text>
        )}
      </View>

      {!user ? (
        // Pantalla de autenticación
        <View style={styles.authContainer}>
          <Text style={styles.subtitle}>🔐 Iniciar Sesión / Registrarse</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!authLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!authLoading}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.button, 
                (!firebaseConnected || authLoading) && styles.disabledButton
              ]} 
              onPress={signIn}
              disabled={!firebaseConnected || authLoading}
            >
              {authLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.secondaryButton, 
                (!firebaseConnected || authLoading) && styles.disabledButton
              ]} 
              onPress={signUp}
              disabled={!firebaseConnected || authLoading}
            >
              {authLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Pantalla principal (usuario autenticado)
        <View style={styles.mainContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>👋 Bienvenido, {user.displayName}</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Formulario para agregar notas */}
          <View style={styles.noteForm}>
            <Text style={styles.subtitle}>📝 Agregar Nueva Nota</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título de la nota"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Contenido de la nota"
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
              numberOfLines={4}
            />
            
            <TouchableOpacity 
              style={[styles.button, !firebaseConnected && styles.disabledButton]} 
              onPress={addNote}
              disabled={!firebaseConnected}
            >
              <Text style={styles.buttonText}>Agregar Nota</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de notas */}
          <View style={styles.notesContainer}>
            <Text style={styles.subtitle}>📋 Mis Notas ({notes.length})</Text>
            
            {notes.length === 0 ? (
              <Text style={styles.emptyText}>
                No tienes notas aún. ¡Agrega tu primera nota!
              </Text>
            ) : (
              notes.map((note) => (
                <View key={note.id} style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle} numberOfLines={1}>
                      {note.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteNote(note.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noteContent} numberOfLines={3}>
                    {note.content}
                  </Text>
                  <Text style={styles.noteDate}>
                    {note.createdAt.toLocaleDateString('es-ES')} {note.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  connectionStatus: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 5,
  },
  disconnectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 5,
  },
  projectInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  authContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContainer: {
    flex: 1,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noteForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default FirebaseExample;
