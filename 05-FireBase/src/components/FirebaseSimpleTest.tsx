import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

const FirebaseSimpleTest: React.FC = () => {
  const [status, setStatus] = useState<string>('🔄 Iniciando...');
  const [step, setStep] = useState<number>(0);

  const testStep1 = async () => {
    try {
      setStatus('📦 Paso 1: Importando Firebase App...');
      setStep(1);
      
      const firebase = await import('@react-native-firebase/app');
      setStatus('✅ Paso 1: Firebase App importado');
      
      setTimeout(() => testStep2(firebase), 1000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setStatus(`❌ Paso 1 falló: ${errorMsg}`);
      console.error('Error en paso 1:', error);
    }
  };

  const testStep2 = async (firebase: any) => {
    try {
      setStatus('🔧 Paso 2: Verificando configuración...');
      setStep(2);
      
      console.log('Firebase default app:', firebase.default);
      console.log('Firebase apps:', firebase.default.apps);
      
      const app = firebase.default.app();
      console.log('App obtenida:', app);
      console.log('App options:', app.options);
      
      const projectId = app.options.projectId;
      console.log('Project ID:', projectId);
      
      if (!projectId) {
        throw new Error('No se encontró Project ID. Verifica GoogleService-Info.plist');
      }
      
      setStatus(`✅ Paso 2: Proyecto conectado: ${projectId}`);
      
      setTimeout(() => testStep3(), 1000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error detallado en paso 2:', error);
      console.error('Stack trace:', (error as Error)?.stack);
      setStatus(`❌ Paso 2 falló: ${errorMsg}`);
    }
  };

  const testStep3 = async () => {
    try {
      setStatus('🔐 Paso 3: Probando Auth...');
      setStep(3);
      
      const auth = await import('@react-native-firebase/auth');
      const authInstance = auth.default();
      
      setStatus(`✅ Paso 3: Auth listo (Usuario: ${authInstance.currentUser?.uid || 'ninguno'})`);
      
      setTimeout(() => setStatus('🎉 ¡Firebase funciona correctamente!'), 1000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setStatus(`❌ Paso 3 falló: ${errorMsg}`);
      console.error('Error en paso 3:', error);
    }
  };

  const startTest = () => {
    setStep(0);
    setStatus('🔄 Iniciando prueba...');
    setTimeout(testStep1, 500);
  };

  const testAuth = async () => {
    try {
      const auth = await import('@react-native-firebase/auth');
      await auth.default().signInAnonymously();
      Alert.alert('✅ Éxito', 'Login anónimo exitoso');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('❌ Error', errorMsg);
    }
  };

  useEffect(() => {
    startTest();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔥 Firebase Test Simple</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.stepText}>Paso actual: {step}/3</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={startTest}>
            <Text style={styles.buttonText}>🔄 Probar de nuevo</Text>
          </TouchableOpacity>
          
          {step >= 3 && (
            <TouchableOpacity style={[styles.button, styles.authButton]} onPress={testAuth}>
              <Text style={styles.buttonText}>🔐 Probar Login</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    minHeight: 100,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  authButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FirebaseSimpleTest;
