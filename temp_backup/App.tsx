/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  Text, 
  Pressable,
  Alert 
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [count, setCount] = useState<number>(0);

  const handlePress = (): void => {
    setCount(prevCount => prevCount + 1);
  };

  const handleLongPress = (): void => {
    setCount(0);
    Alert.alert('Contador reiniciado', 'El contador se ha reiniciado a 0');
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Contador con Pressable</Text>
        
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={handlePress}
          onLongPress={handleLongPress}
        >
          <Text style={styles.buttonText}>
            Presiona para +1 | Mantén presionado para reiniciar
          </Text>
        </Pressable>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>• Presiona: +1</Text>
          <Text style={styles.instructionText}>• Mantén presionado: Reiniciar</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  counterContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  counterText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    minWidth: 120,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: '#0056CC',
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default App;
