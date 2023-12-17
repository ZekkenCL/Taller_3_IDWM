import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

// Componente de pantalla para editar el perfil del usuario.
const EditarPerfilScreen = ({ navigation }) => {
// Accede a la información del usuario y la función de actualización desde el contexto de autenticación.
  const { user,setUser } = useContext(AuthContext);

// Estados para gestionar el nombre, correo electrónico, fecha de nacimiento y modal.
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [birthdate, setBirthdate] = useState(user.birthdate || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

// Token del usuario para autenticación con la API.
  const { token } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  
// Funciones para validar el correo electrónico, nombre, RUT y fecha de nacimiento.
  const esCorreoValido = (email) => /^[a-zA-Z0-9_.+-]+@(ucn.cl|alumnos.ucn.cl|disc.ucn.cl|ce.ucn.cl)$/.test(email);
  const esNombreValido = (nombre) => nombre.length >= 10 && nombre.length <= 150;
  const validarRut = (rutCompleto) => {
// Eliminar puntos y guión
    const rut = rutCompleto.replace(/\./g, '').replace('-', '');
    const cuerpo = rut.slice(0, -1); // Obtener el cuerpo del RUT
    const dv = rut.slice(-1).toUpperCase(); // Obtener el dígito verificador
  
// Calcular el dígito verificador
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplicador * parseInt(cuerpo.charAt(i), 10);
      multiplicador = (multiplicador < 7) ? multiplicador + 1 : 2;
    }
  
    const dvEsperado = (11 - (suma % 11)).toString();
    if (dvEsperado === '10') return 'K' === dv;
    if (dvEsperado === '11') return '0' === dv;
    return dvEsperado === dv;
  };
  const esAnioNacimientoValido = (fechaNacimiento) => {
    const partes = fechaNacimiento.split('-');
    const anio = parseInt(partes[2], 10);
    const anioActual = new Date().getFullYear();
    return anio >= 1900 && anio <= anioActual;
  };
  const formatearFecha = (texto) => {
    if (!texto) return '';
  
    // Eliminar cualquier carácter que no sea número
    const numeros = texto.replace(/[^\d]/g, '');
  
    // Dividir los números en grupos para dd, mm, aaaa
    let partes = numeros.match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
  
    // Combinar las partes con separadores
    return `${partes[1]}${partes[2] ? '-' : ''}${partes[2]}${partes[3] ? '-' : ''}${partes[3]}`;
  };

// Función para manejar la actualización del perfil.
  const handleUpdateProfile = async () => {
    // Verificar si los campos están llenos.
    if (!name || !email || !birthdate) {
      setModalMessage('Todos los campos son obligatorios.');
      setModalVisible(true);
      return;
    }

    // Verificar validez de los campos.
    if (!esCorreoValido(email) || !esNombreValido(name) || !esAnioNacimientoValido(birthdate)) {
      setModalMessage('Por favor, verifica tus datos.');
      setModalVisible(true);
      return;
    }

    try {
      // Llama al servicio de autenticación para actualizar el perfil y muestra un mensaje de éxito.
      const updatedUser = await AuthService.updateProfile({ name, email, birthdate },user.id, token);
      setUser(updatedUser);// Actualiza el contexto del usuario
      setModalMessage('Perfil actualizado con éxito. Serás redirigido al inicio de sesión.');
      setModalVisible(true);

      setTimeout(() => {
        logout();
        navigation.navigate('Login');
      }, 3000);
      
    } catch (error) {
      // Muestra un mensaje de error si la actualización falla.
      setModalMessage(error.message || 'Error al actualizar el perfil');
      setModalVisible(true);
    }
  };
// Renderiza los elementos de la interfaz, incluyendo campos de texto y un botón para enviar.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre Completo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput label="Fecha de Nacimiento (dd-mm-aaaa)" value={birthdate} onChangeText={(text) => setBirthdate(formatearFecha(text))} style={styles.input} />
      <Button
        mode="contained"
        onPress={handleUpdateProfile}
        style={styles.button}>
        Actualizar Perfil
      </Button>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text>{modalMessage}</Text>
            <Button onPress={() => setModalVisible(false)}>Cerrar</Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default EditarPerfilScreen;
