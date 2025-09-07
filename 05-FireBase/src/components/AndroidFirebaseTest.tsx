import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { androidUtils } from '../config/firebase-android';

const AndroidFirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Iniciando...');
  const [tests, setTests] = useState<{[key: string]: boolean}>({});
  const [androidInfo, setAndroidInfo] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      runAndroidTests();
      setAndroidInfo(androidUtils.getAndroidInfo());
    }
  }, []);

  const runAndroidTests = async () => {
    setStatus('Ejecutando pruebas de Android...');
    const testResults: {[key: string]: boolean} = {};

    try {
      // Test 1: Verificar inicialización de Firebase
      setStatus('Probando inicialización de Firebase...');
      testResults.firebaseInit = auth().app !== null;

      // Test 2: Verificar conexión de red
      setStatus('Probando conexión de red...');
      testResults.networkConnection = await androidUtils.checkNetworkAndroid();

      // Test 3: Probar Firestore en Android
      setStatus('Probando Firestore...');
      try {
        const testDoc = firestore().collection('androidTest').doc('test');
        await testDoc.set({
          message: 'Test desde Android',
          timestamp: firestore.FieldValue.serverTimestamp(),
          platform: Platform.OS,
          version: Platform.Version,
        });
        const docSnap = await testDoc.get();
        testResults.firestoreTest = docSnap.exists;
      } catch (error) {
        console.error('Error en Firestore test:', error);
        testResults.firestoreTest = false;
      }

      // Test 4: Probar Storage en Android
      setStatus('Probando Storage...');
      try {
        const reference = storage().ref('androidTest/test.txt');
        await reference.putString('Test desde Android', 'raw');
        const downloadURL = await reference.getDownloadURL();
        testResults.storageTest = downloadURL.length > 0;
      } catch (error) {
        console.error('Error en Storage test:', error);
        testResults.storageTest = false;
      }

      // Test 5: Probar Auth en Android
      setStatus('Probando Auth...');
      try {
        // Simplemente verificar que Auth esté disponible
        testResults.authTest = auth().currentUser !== undefined;
      } catch (error) {
        console.error('Error en Auth test:', error);
        testResults.authTest = false;
      }

      setTests(testResults);
      setStatus('Pruebas completadas');
    } catch (error) {
      console.error('Error en pruebas:', error);
      setStatus('Error en las pruebas');
    }
  };

  const clearCache = async () => {
    try {
      const success = await androidUtils.clearAndroidCache();
      Alert.alert(
        'Caché',
        success ? 'Caché limpiado exitosamente' : 'Error al limpiar caché'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo limpiar el caché');
    }
  };

  const testNetworkConnection = async () => {
    setStatus('Probando conexión...');
    const isConnected = await androidUtils.checkNetworkAndroid();
    Alert.alert(
      'Conexión',
      isConnected ? 'Conexión exitosa' : 'Sin conexión'
    );
    setStatus('Listo');
  };

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>❌ Este componente es solo para Android</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🤖 Pruebas de Firebase para Android</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.status}>Estado: {status}</Text>
      </View>

      {androidInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>📱 Información del Dispositivo</Text>
          <Text style={styles.infoText}>Plataforma: {androidInfo.platform}</Text>
          <Text style={styles.infoText}>Versión Android: {androidInfo.version}</Text>
          <Text style={styles.infoText}>Firebase SDK: {androidInfo.firebaseVersion}</Text>
          <Text style={styles.infoText}>App ID: {androidInfo.appId}</Text>
          <Text style={styles.infoText}>Project ID: {androidInfo.projectId}</Text>
        </View>
      )}

      <View style={styles.testsContainer}>
        <Text style={styles.sectionTitle}>🧪 Resultados de Pruebas</Text>
        {Object.entries(tests).map(([testName, result]) => (
          <View key={testName} style={styles.testItem}>
            <Text style={styles.testName}>
              {result ? '✅' : '❌'} {testName}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>🔧 Acciones de Prueba</Text>
        
        <TouchableOpacity style={styles.button} onPress={runAndroidTests}>
          <Text style={styles.buttonText}>🔄 Ejecutar Pruebas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testNetworkConnection}>
          <Text style={styles.buttonText}>🌐 Probar Conexión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={clearCache}>
          <Text style={styles.buttonText}>🧹 Limpiar Caché</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.helpContainer}>
        <Text style={styles.sectionTitle}>💡 Ayuda</Text>
        <Text style={styles.helpText}>
          • Si las pruebas fallan, verifica que google-services.json esté configurado correctamente
        </Text>
        <Text style={styles.helpText}>
          • Asegúrate de tener conexión a internet
        </Text>
        <Text style={styles.helpText}>
          • Si persisten errores, limpia el caché y reinicia la app
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#1976d2',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeft: 4,
    borderLeftColor: '#4caf50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  testsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeft: 4,
    borderLeftColor: '#ff9800',
  },
  testItem: {
    paddingVertical: 5,
  },
  testName: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeft: 4,
    borderLeftColor: '#2196f3',
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    borderLeft: 4,
    borderLeftColor: '#ff9800',
  },
  helpText: {
    fontSize: 14,
    color: '#e65100',
    marginBottom: 5,
  },
});

export default AndroidFirebaseTest;
