import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext'; 

// Componente de pantalla de inicio de sesión.
const LoginScreen = ({ navigation }) => {
// Estados para manejar el correo electrónico, contraseña y mensajes de error.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
// Extrae la función de inicio de sesión del contexto
  const { login } = useAuth();

  // Maneja el proceso de inicio de sesión.
  const handleLogin = async () => {
    try {
      // Intenta iniciar sesión con el servicio de autenticación.
      const response = await AuthService.login(email, password);
      if (response.access_token) {
        // Si se recibe un token, inicia sesión y navega a la pantalla principal.
        login(response.user, response.access_token);
        navigation.navigate('MenuPrincipal');
      } else {
        // Si no se recibe un token, muestra un mensaje de error.
        setErrorMessage('Error al iniciar sesion');
        setErrorModalVisible(true);
      }
    } catch (error) {
      // Maneja errores durante el inicio de sesión, mostrando un mensaje de error.
      setErrorMessage(error.message || 'Error al iniciar sesión');
      setErrorModalVisible(true);
    }
  };
  
  // Renderiza los elementos de la interfaz de usuario.
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
        label="Contraseña"
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
