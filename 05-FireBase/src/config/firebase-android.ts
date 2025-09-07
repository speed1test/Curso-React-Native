// Configuración específica de Firebase para Android
import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Verificar que Firebase esté inicializado correctamente en Android
export const initializeFirebaseAndroid = () => {
  if (Platform.OS === 'android') {
    console.log('🤖 Inicializando Firebase para Android...');
    
    // Verificar que la app esté inicializada
    if (!firebase.apps.length) {
      console.warn('⚠️ Firebase no está inicializada. Verificar google-services.json');
      return false;
    }
    
    console.log('✅ Firebase inicializada correctamente en Android');
    console.log('📱 App ID:', firebase.app().options.appId);
    console.log('🔑 Project ID:', firebase.app().options.projectId);
    
    return true;
  }
  return false;
};

// Configuración específica para Auth en Android
export const configureAuthAndroid = () => {
  if (Platform.OS === 'android') {
    // Configuraciones específicas para Android si son necesarias
    console.log('🔐 Configurando Auth para Android...');
    
    // Verificar que Auth esté disponible
    if (auth().currentUser) {
      console.log('👤 Usuario autenticado:', auth().currentUser?.email);
    } else {
      console.log('👥 No hay usuario autenticado');
    }
  }
};

// Configuración específica para Firestore en Android
export const configureFirestoreAndroid = () => {
  if (Platform.OS === 'android') {
    console.log('📊 Configurando Firestore para Android...');
    
    // Habilitar persistencia offline en Android
    firestore().settings({
      persistence: true,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    });
    
    console.log('✅ Firestore configurado con persistencia offline');
  }
};

// Configuración específica para Storage en Android
export const configureStorageAndroid = () => {
  if (Platform.OS === 'android') {
    console.log('💾 Configurando Storage para Android...');
    
    // Configurar timeout personalizado para Android
    const storageRef = storage().ref();
    console.log('✅ Storage configurado:', storageRef.bucket);
  }
};

// Función principal para inicializar todas las configuraciones de Android
export const initializeAndroid = async () => {
  if (Platform.OS !== 'android') {
    return;
  }
  
  console.log('🚀 Inicializando configuración completa de Firebase para Android...');
  
  try {
    // Inicializar Firebase
    const isInitialized = initializeFirebaseAndroid();
    if (!isInitialized) {
      throw new Error('Firebase no pudo inicializarse en Android');
    }
    
    // Configurar servicios
    configureAuthAndroid();
    configureFirestoreAndroid();
    configureStorageAndroid();
    
    console.log('✅ Configuración de Android completada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase en Android:', error);
    return false;
  }
};

// Funciones de utilidad específicas para Android
export const androidUtils = {
  // Verificar conectividad de red en Android
  checkNetworkAndroid: async () => {
    if (Platform.OS === 'android') {
      try {
        // Probar conexión con Firestore
        await firestore().doc('test/connection').get();
        console.log('🌐 Conexión a Firestore exitosa en Android');
        return true;
      } catch (error) {
        console.error('🚫 Error de conexión en Android:', error);
        return false;
      }
    }
    return false;
  },
  
  // Limpiar caché específico de Android
  clearAndroidCache: async () => {
    if (Platform.OS === 'android') {
      try {
        await firestore().clearPersistence();
        console.log('🧹 Caché de Android limpiado');
        return true;
      } catch (error) {
        console.error('❌ Error al limpiar caché en Android:', error);
        return false;
      }
    }
    return false;
  },
  
  // Información del dispositivo Android
  getAndroidInfo: () => {
    if (Platform.OS === 'android') {
      return {
        platform: Platform.OS,
        version: Platform.Version,
        firebaseVersion: firebase.SDK_VERSION,
        appId: firebase.app().options.appId,
        projectId: firebase.app().options.projectId,
      };
    }
    return null;
  },
};

export default {
  initializeAndroid,
  androidUtils,
};
