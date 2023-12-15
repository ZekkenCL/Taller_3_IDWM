// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await AuthService.login(email, password);
      //prueba para ver si retorna el token
      console.log(response);
      if (response.access_token) {
        login(response.access_token);

      } else {
        setErrorMessage('No se recibió el token');
        setErrorModalVisible(true);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error al iniciar sesión');
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
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="RUT (sin puntos ni guión)"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Iniciar Sesión
      </Button>

      <Portal>
        <Modal visible={errorModalVisible} onDismiss={() => setErrorModalVisible(false)}>
          <View style={styles.modalContent}>
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
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 20,
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

export default LoginScreen;
