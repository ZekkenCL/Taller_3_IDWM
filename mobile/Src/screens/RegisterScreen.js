// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService'; // Ajusta la ruta según sea necesario

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [dni, setDni] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await AuthService.register(email, name, birthYear, dni);
      Alert.alert('Registro exitoso', 'Puedes iniciar sesión ahora');
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage(error.message || 'Error en el registro');
      setErrorModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Nombre Completo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Año de Nacimiento"
        value={birthYear}
        onChangeText={setBirthYear}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="RUT"
        value={dni}
        onChangeText={setDni}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>

      <Portal>
        <Modal visible={errorModalVisible} onDismiss={() => setErrorModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text>Error</Text>
            <Text>{errorMessage}</Text>
            <Button onPress={() => setErrorModalVisible(false)}>Cerrar</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
});

export default RegisterScreen;
