import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

const HelloWorldScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.content}>
        <Text 
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          ¡Hola Mundo! Bienvenido a React Native
        </Text>
        
        <Text 
          style={styles.subtitle}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          Hello World! Welcome to React Native Development
        </Text>
        
        <Text 
          style={styles.description}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          Bienvenido a tu primera aplicación React Native. Este es un texto largo que demuestra el uso de numberOfLines y ellipsizeMode para controlar cómo se muestra el texto cuando es muy extenso.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Abrir Modal</Text>
        </TouchableOpacity>
        
        <View style={styles.card}>
          <Text 
            style={styles.cardText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Curso del Chele Casaca. Aprende React Native paso a paso con ejemplos prácticos.
          </Text>
        </View>
      </View>

      {/* Modal emergente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Pantalla Emergente!</Text>
            <Text 
              style={styles.modalText}
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              Este es un modal que demuestra cómo crear pantallas emergentes en React Native. Puedes usar modales para mostrar información adicional, formularios, confirmaciones y mucho más.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cerrar</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => {
                  setModalVisible(false);
                  // Aquí puedes agregar más lógica
                }}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 34,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  cardText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
    maxWidth: 350,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#6c757d',
  },
  modalButtonConfirm: {
    backgroundColor: '#28a745',
  },
  modalButtonTextCancel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButtonTextConfirm: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HelloWorldScreen;
