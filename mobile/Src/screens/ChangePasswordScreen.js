import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

// Componente de pantalla para cambiar la contraseña del usuario.
const ChangePasswordScreen = ({ navigation }) => {
  // Utiliza el contexto de autenticación para acceder al token y a la función de cierre de sesión.
  const { token, logout } = useContext(AuthContext);

  // Estados para gestionar la nueva contraseña, su confirmación y la visibilidad y mensaje del modal.
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Función para manejar el cambio de contraseña.
  const handleChangePassword = async () => {
    // Verifica si las contraseñas coinciden.
    if (newPassword !== confirmPassword) {
      setModalMessage('Las contraseñas no coinciden.');
      setModalVisible(true);
      return;
    }

    try {
      // Llama al servicio de autenticación para actualizar la contraseña y muestra un mensaje de éxito.
      await AuthService.updatePassword({ nueva_password: newPassword }, token);
      setModalMessage('Contraseña actualizada con éxito. Serás redirigido al inicio de sesión.');
      setModalVisible(true);

      // Después de un retraso, cierra la sesión y redirige al usuario a la pantalla de inicio de sesión.
      setTimeout(() => {
        logout();
        navigation.navigate('Login');
      }, 3000);
    } catch (error) {
      // Muestra un mensaje de error si la actualización falla.
      setModalMessage(error.message || 'Error al actualizar la contraseña');
      setModalVisible(true);
    }
  };

  // Renderiza los elementos de la interfaz, incluyendo campos de texto para las contraseñas y un botón para enviar.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nueva Contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        label="Confirmar Nueva Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
        Cambiar Contraseña
      </Button>

      {/* Modal para mostrar mensajes al usuario */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text>{modalMessage}</Text>
            <Button onPress={() => {
              setModalVisible(false);
              // Cierra la sesión y redirige si el mensaje incluye "éxito".
              if (modalMessage.includes('éxito')) {
                logout();
                navigation.navigate('Login');
              }
            }}>Cerrar</Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

// Estilos para la pantalla.
const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;
