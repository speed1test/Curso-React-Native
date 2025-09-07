import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface User {
  id: string;
  first: string;
  last: string;
  middle?: string;
  born: number;
  email?: string;
  createdAt: any;
}

interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

const FirestoreExample: React.FC = () => {
  // Estados para autenticación
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [newUserFirst, setNewUserFirst] = useState('');
  const [newUserLast, setNewUserLast] = useState('');
  const [newUserMiddle, setNewUserMiddle] = useState('');
  const [newUserBorn, setNewUserBorn] = useState('');

  // Estados para notas
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Estado de carga
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Función para actualizar timestamp
  const updateLastRefresh = () => {
    const now = new Date();
    setLastUpdate(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
  };

  // Monitor de autenticación
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listeners en tiempo real para colecciones (corregidos)
  useEffect(() => {
    if (!user) {
      // Limpiar datos cuando no hay usuario
      setUsers([]);
      setNotes([]);
      return;
    }

    console.log('🔥 Configurando listeners para usuario:', user.uid);

    // Listener para usuarios (sin orderBy que puede fallar)
    const unsubscribeUsers = firestore()
      .collection('users')
      .onSnapshot(
        (snapshot) => {
          console.log('👥 Usuarios actualizados, total:', snapshot.size);
          const usersData: User[] = [];
          snapshot.forEach((doc) => {
            const userData = doc.data();
            console.log('👤 Usuario:', doc.id, userData);
            usersData.push({
              id: doc.id,
              ...userData,
            } as User);
          });
          // Ordenar manualmente por createdAt
          usersData.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            }
            return 0;
          });
          console.log('👥 Usuarios finales:', usersData.length);
          setUsers(usersData);
          updateLastRefresh();
        },
        (error) => {
          console.error('❌ Error listening to users:', error);
          const fbError = error as any;
          console.error('Error code:', fbError.code || 'Unknown');
          console.error('Error message:', fbError.message || error.message);
        }
      );

    // Listener para notas del usuario actual (sin orderBy problemático)
    const unsubscribeNotes = firestore()
      .collection('notes')
      .where('userId', '==', user.uid)
      .onSnapshot(
        (snapshot) => {
          console.log('📝 Notas actualizadas para usuario', user.uid, ', total:', snapshot.size);
          const notesData: Note[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📄 Nota encontrada:', doc.id, data);
            notesData.push({
              id: doc.id,
              ...data,
            } as Note);
          });
          // Ordenar manualmente por createdAt
          notesData.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            }
            return 0;
          });
          console.log('📝 Notas procesadas y ordenadas:', notesData.length);
          setNotes(notesData);
          updateLastRefresh();
        },
        (error) => {
          console.error('❌ Error listening to notes:', error);
          const fbError = error as any;
          console.error('Error code:', fbError.code || 'Unknown');
          console.error('Error message:', fbError.message || error.message);
        }
      );

    return () => {
      console.log('Limpiando listeners');
      unsubscribeUsers();
      unsubscribeNotes();
    };
  }, [user]);

  // Autenticación anónima
  const signInAnonymously = async () => {
    try {
      setIsProcessing(true);
      await auth().signInAnonymously();
      Alert.alert('Éxito', 'Usuario autenticado anónimamente');
    } catch (error) {
      console.error('Error en autenticación anónima:', error);
      Alert.alert('Error', 'No se pudo autenticar');
    } finally {
      setIsProcessing(false);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      await auth().signOut();
      setUsers([]);
      setNotes([]);
      Alert.alert('Sesión cerrada', 'Usuario desconectado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Agregar usuario a Firestore (adaptado a reglas flexibles)
  const addUser = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para agregar usuarios');
      return;
    }

    try {
      setIsProcessing(true);
      
      const userData: any = {
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Campos opcionales - solo agregar si tienen valor
      if (newUserFirst.trim()) {
        userData.first = newUserFirst.trim();
      }
      
      if (newUserLast.trim()) {
        userData.last = newUserLast.trim();
      }
      
      if (newUserMiddle.trim()) {
        userData.middle = newUserMiddle.trim();
      }
      
      if (newUserBorn.trim()) {
        const bornYear = parseInt(newUserBorn.trim());
        if (!isNaN(bornYear) && bornYear > 1800 && bornYear <= 2025) {
          userData.born = bornYear;
        }
      }

      // Información del usuario autenticado
      userData.createdBy = user.uid;
      if (user?.email) {
        userData.email = user.email;
      }

      const docRef = await firestore()
        .collection('users')
        .add(userData);

      console.log('Usuario agregado con ID:', docRef.id);
      
      // Limpiar campos
      setNewUserFirst('');
      setNewUserLast('');
      setNewUserMiddle('');
      setNewUserBorn('');
      
      Alert.alert('Éxito', `Usuario agregado con ID: ${docRef.id}`);
    } catch (error) {
      console.error('Error agregando usuario:', error);
      Alert.alert('Error', `No se pudo agregar el usuario: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Agregar nota personal (con mejor logging y manejo)
  const addNote = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para agregar notas');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('=== INICIANDO CREACIÓN DE NOTA ===');
      console.log('Usuario actual:', user.uid);
      
      const noteData: any = {
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Campos opcionales - solo agregar si tienen valor
      if (newNoteTitle.trim()) {
        noteData.title = newNoteTitle.trim();
      } else {
        noteData.title = 'Nota sin título';
      }
      
      if (newNoteContent.trim()) {
        noteData.content = newNoteContent.trim();
      } else {
        noteData.content = 'Contenido vacío';
      }

      console.log('Datos a guardar:', noteData);

      const docRef = await firestore()
        .collection('notes')
        .add(noteData);

      console.log('✅ Nota agregada con ID:', docRef.id);
      
      // Limpiar campos
      setNewNoteTitle('');
      setNewNoteContent('');
      
      Alert.alert('Éxito', `Nota agregada con ID: ${docRef.id}`);
      
      // Forzar actualización manual si es necesario
      console.log('Estado actual de notas:', notes.length);
      
    } catch (error: any) {
      console.error('❌ Error agregando nota:', error);
      console.error('Error details:', error);
      
      let errorMessage = `No se pudo agregar la nota: ${error.message || error}`;
      
      if (error.code === 'firestore/permission-denied') {
        errorMessage = 'Sin permisos para crear notas. Verifica las reglas de Firestore.';
      } else if (error.code === 'firestore/unavailable') {
        errorMessage = 'Servicio no disponible. Intenta más tarde.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };  // Eliminar usuario (con mejor manejo de errores)
  const deleteUser = async (userId: string) => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para eliminar usuarios');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Intentando eliminar usuario con ID:', userId);
              console.log('👤 Usuario autenticado:', user.uid);
              console.log('📊 Usuarios antes de eliminar:', users.length);
              
              await firestore()
                .collection('users')
                .doc(userId)
                .delete();
              
              console.log('✅ Usuario eliminado exitosamente de Firestore');
              console.log('🔄 Esperando actualización del listener...');
              Alert.alert('Éxito', 'Usuario eliminado');
            } catch (error: any) {
              console.error('Error eliminando usuario:', error);
              console.error('Código de error:', error.code);
              console.error('Mensaje:', error.message);
              
              let errorMessage = 'No se pudo eliminar el usuario';
              
              if (error.code === 'firestore/permission-denied') {
                errorMessage = 'Sin permisos para eliminar. Verifica las reglas de Firestore.';
              } else if (error.code === 'firestore/not-found') {
                errorMessage = 'Usuario no encontrado.';
              } else if (error.code === 'firestore/unavailable') {
                errorMessage = 'Servicio no disponible. Intenta más tarde.';
              }
              
              Alert.alert('Error', `${errorMessage}\n\nCódigo: ${error.code}`);
            }
          },
        },
      ]
    );
  };

  // Eliminar nota (con mejor manejo de errores)
  const deleteNote = async (noteId: string) => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para eliminar notas');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Intentando eliminar nota con ID:', noteId);
              console.log('👤 Usuario autenticado:', user.uid);
              console.log('📝 Notas antes de eliminar:', notes.length);
              
              await firestore()
                .collection('notes')
                .doc(noteId)
                .delete();
              
              console.log('✅ Nota eliminada exitosamente de Firestore');
              console.log('🔄 Esperando actualización del listener...');
              Alert.alert('Éxito', 'Nota eliminada');
            } catch (error: any) {
              console.error('Error eliminando nota:', error);
              console.error('Código de error:', error.code);
              console.error('Mensaje:', error.message);
              
              let errorMessage = 'No se pudo eliminar la nota';
              
              if (error.code === 'firestore/permission-denied') {
                errorMessage = 'Sin permisos para eliminar esta nota.';
              } else if (error.code === 'firestore/not-found') {
                errorMessage = 'Nota no encontrada.';
              }
              
              Alert.alert('Error', `${errorMessage}\n\nCódigo: ${error.code}`);
            }
          },
        },
      ]
    );
  };

  // Función de prueba para la colección test (desarrollo)
  const testFirestoreRules = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para hacer pruebas');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Crear documento de prueba
      const testData = {
        type: 'test',
        message: 'Prueba de reglas de Firestore',
        userId: user.uid,
        timestamp: firestore.FieldValue.serverTimestamp(),
        features: {
          anonymousAuth: true,
          flexibleValidation: true,
          testCollection: true
        }
      };

      const docRef = await firestore()
        .collection('test')
        .add(testData);

      console.log('Documento de prueba creado con ID:', docRef.id);

      // Leer documentos de prueba
      const testSnapshot = await firestore()
        .collection('test')
        .where('userId', '==', user.uid)
        .get();

      console.log('=== DOCUMENTOS DE PRUEBA ===');
      testSnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });

      // Eliminar documento de prueba
      await firestore()
        .collection('test')
        .doc(docRef.id)
        .delete();

      console.log('Documento de prueba eliminado');
      
      Alert.alert('Prueba Exitosa', 
        'Las reglas de Firestore funcionan correctamente.\n\n' +
        '✅ Creación permitida\n' +
        '✅ Lectura permitida\n' +
        '✅ Eliminación permitida\n\n' +
        'Revisa la consola para más detalles.'
      );
    } catch (error) {
      console.error('Error en prueba de reglas:', error);
      Alert.alert('Error en Prueba', `Problema con las reglas: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Obtener todos los datos (ejemplo de lectura)
  const getAllData = async () => {
    try {
      setIsProcessing(true);
      
      // Obtener usuarios
      const usersSnapshot = await firestore()
        .collection('users')
        .get();
      
      console.log('=== USUARIOS ===');
      usersSnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });

      // Obtener notas si hay usuario autenticado
      if (user) {
        const notesSnapshot = await firestore()
          .collection('notes')
          .where('userId', '==', user.uid)
          .get();
        
        console.log('=== NOTAS ===');
        notesSnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data());
        });
      }

      Alert.alert('Datos obtenidos', 'Revisa la consola para ver los datos');
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      Alert.alert('Error', 'No se pudieron obtener los datos');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>
        {item.first} {item.middle ? `${item.middle} ` : ''}{item.last}
      </Text>
      <Text style={styles.itemSubtitle}>Nacido en: {item.born}</Text>
      {item.email && <Text style={styles.itemSubtitle}>Email: {item.email}</Text>}
      <Text style={styles.itemId}>ID: {item.id}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteUser(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemId}>ID: {item.id}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNote(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>Cloud Firestore Example</Text>
          <Text style={styles.subtitle}>Necesitas autenticarte para continuar</Text>
          
          <TouchableOpacity
            style={[styles.button, { opacity: isProcessing ? 0.5 : 1 }]}
            onPress={signInAnonymously}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Autenticación Anónima</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cloud Firestore</Text>
        <Text style={styles.subtitle}>Usuario: {user.uid.substring(0, 8)}...</Text>
        {lastUpdate ? (
          <Text style={styles.lastUpdateText}>🔄 Última actualización: {lastUpdate}</Text>
        ) : null}
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.content}
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            {/* Sección para agregar usuarios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agregar Usuario (Campos Opcionales)</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nombre (opcional)"
                placeholderTextColor="#999"
                value={newUserFirst}
                onChangeText={setNewUserFirst}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Segundo nombre (opcional)"
                placeholderTextColor="#999"
                value={newUserMiddle}
                onChangeText={setNewUserMiddle}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Apellido (opcional)"
                placeholderTextColor="#999"
                value={newUserLast}
                onChangeText={setNewUserLast}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Año de nacimiento (opcional, 1800-2025)"
                placeholderTextColor="#999"
                value={newUserBorn}
                onChangeText={setNewUserBorn}
                keyboardType="numeric"
              />
              
              <TouchableOpacity
                style={[styles.button, { opacity: isProcessing ? 0.5 : 1 }]}
                onPress={addUser}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Agregar Usuario</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Sección para agregar notas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agregar Nota Personal (Campos Opcionales)</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Título de la nota (opcional)"
                placeholderTextColor="#999"
                value={newNoteTitle}
                onChangeText={setNewNoteTitle}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Contenido de la nota (opcional)"
                placeholderTextColor="#999"
                value={newNoteContent}
                onChangeText={setNewNoteContent}
                multiline
                numberOfLines={3}
              />
              
              <TouchableOpacity
                style={[styles.button, { opacity: isProcessing ? 0.5 : 1 }]}
                onPress={addNote}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Agregar Nota</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Botones para obtener datos y probar reglas */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.secondaryButton, { opacity: isProcessing ? 0.5 : 1 }]}
                onPress={getAllData}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <Text style={styles.secondaryButtonText}>Obtener Todos los Datos</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testButton, { opacity: isProcessing ? 0.5 : 1, marginTop: 10 }]}
                onPress={testFirestoreRules}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>🧪 Probar Reglas Flexibles</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Lista de usuarios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Usuarios ({users.length})</Text>
              {users.map((user) => (
                <View key={user.id}>
                  {renderUser({ item: user })}
                </View>
              ))}
            </View>

            {/* Lista de notas personales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mis Notas ({notes.length})</Text>
              {notes.map((note) => (
                <View key={note.id}>
                  {renderNote({ item: note })}
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  lastUpdateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 3,
    fontStyle: 'italic',
  },
  signOutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemId: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Courier',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FirestoreExample;
