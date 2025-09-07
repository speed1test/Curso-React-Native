import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const FirebaseTest: React.FC = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('🔄 Verificando...');
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  const testFirebaseImport = async () => {
    try {
      console.log('📦 Intentando importar Firebase...');
      
      // Intentar importar Firebase paso a paso
      const firebase = await import('@react-native-firebase/app');
      console.log('✅ Firebase app importado');
      setFirebaseStatus('📦 Firebase app: ✅');
      
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      const auth = await import('@react-native-firebase/auth');
      console.log('✅ Firebase auth importado');
      setFirebaseStatus('🔐 Firebase auth: ✅');
      
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      const firestore = await import('@react-native-firebase/firestore');
      console.log('✅ Firebase firestore importado');
      setFirebaseStatus('📄 Firebase firestore: ✅');
      
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      // Intentar acceder a la instancia de Firebase
      const app = firebase.default.app();
      console.log('✅ Firebase app instance:', app.name);
      console.log('📋 Project ID:', app.options.projectId);
      
      setFirebaseStatus(`✅ Firebase conectado\n📋 Proyecto: ${app.options.projectId}`);
      setFirebaseLoaded(true);
      
    } catch (error) {
      console.error('❌ Error con Firebase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setFirebaseStatus(`❌ Error: ${errorMessage}`);
      setFirebaseLoaded(false);
    }
  };

  const testFirebaseAuth = async () => {
    try {
      const auth = await import('@react-native-firebase/auth');
      const authInstance = auth.default();
      console.log('🔐 Auth instance:', !!authInstance);
      Alert.alert('✅ Éxito', 'Firebase Auth funciona correctamente');
    } catch (error) {
      console.error('❌ Error con Auth:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('❌ Error', `Auth falló: ${errorMessage}`);
    }
  };

  const testFirestore = async () => {
    try {
      const firestore = await import('@react-native-firebase/firestore');
      const firestoreInstance = firestore.default();
      console.log('📄 Firestore instance:', !!firestoreInstance);
      Alert.alert('✅ Éxito', 'Firebase Firestore funciona correctamente');
    } catch (error) {
      console.error('❌ Error con Firestore:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('❌ Error', `Firestore falló: ${errorMessage}`);
    }
  };

  useEffect(() => {
    testFirebaseImport();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔥 Firebase Test</Text>
        
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Estado de Firebase:</Text>
          <Text style={styles.statusText}>{firebaseStatus}</Text>
        </View>

        {firebaseLoaded && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={testFirebaseAuth}>
              <Text style={styles.buttonText}>🔐 Probar Auth</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={testFirestore}>
              <Text style={styles.buttonText}>📄 Probar Firestore</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ Información de Debug:</Text>
          <Text style={styles.infoText}>
            • Firebase instalado: {firebaseLoaded ? '✅' : '❌'}{'\n'}
            • Metro servidor: ✅ (puerto 8081){'\n'}
            • Plataforma: iOS Simulator{'\n'}
            • React Native: 0.81.1
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusCard: {
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
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FirebaseTest;
