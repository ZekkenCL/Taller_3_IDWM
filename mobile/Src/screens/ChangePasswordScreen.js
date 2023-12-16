import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
  const { token, logout } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setModalMessage('Las contraseñas no coinciden.');
      setModalVisible(true);
      return;
    }

    try {
      await AuthService.updatePassword({ nueva_password: newPassword }, token);
      setModalMessage('Contraseña actualizada con éxito. Serás redirigido al inicio de sesión.');
      setModalVisible(true);

      setTimeout(() => {
        logout();
        navigation.navigate('Login');
      }, 3000);
    } catch (error) {
      setModalMessage(error.message || 'Error al actualizar la contraseña');
      setModalVisible(true);
    }
  };

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

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text>{modalMessage}</Text>
            <Button onPress={() => {
              setModalVisible(false);
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
