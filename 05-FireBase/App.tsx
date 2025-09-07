/**
 * Sample React Native App with Firebase
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Platform, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import FirestoreExample from './src/components/FirestoreExample';
import { initializeAndroid } from './src/config/firebase-android';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Inicializar configuración específica de Android
    if (Platform.OS === 'android') {
      initializeAndroid();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {/* {Platform.OS === 'android' && (
        <View style={styles.androidHeader}>
          <Text style={styles.androidHeaderText}>🤖 Firebase para Android configurado</Text>
        </View>
      )} */}
      <FirestoreExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  androidHeader: {
    backgroundColor: '#4caf50',
    padding: 10,
    alignItems: 'center',
  },
  androidHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
