import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';

// Componente para la pantalla de registro de usuarios.
const RegisterScreen = ({ navigation }) => {

  // Estados para almacenar los valores ingresados por el usuario.
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [dni, setDni] = useState('');
    // Estados para controlar la visibilidad de los modales y mensajes de error.
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

// Funciones de validación para los campos del formulario.
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
  
  const formatearRut = (texto) => {
    if (!texto) return '';
  
    // Eliminar caracteres no deseados
    let numeros = texto.replace(/[^0-9Kk]/g, '').toUpperCase();
  
    // Formatear según la longitud del RUT
    if (numeros.length <= 1) {
      return numeros;
    }
  
    // Separar dígito verificador
    let dv = numeros.slice(-1);
    let cuerpo = numeros.slice(0, -1);
  
    // Formatear cuerpo con puntos
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    // Combinar cuerpo y dígito verificador
    return `${cuerpo}-${dv}`;
  };
  
// Manejador para el registro de usuarios.
  const handleRegister = async () => {
    // Verificar que todos los campos estén llenos y sean válidos.
    if (!email || !name || !birthdate || !dni) {
      setErrorMessage('Todos los campos son obligatorios.');
      setErrorModalVisible(true);
      return;
    }

    if (!esCorreoValido(email) || !validarRut(dni) || !esNombreValido(name) || !esAnioNacimientoValido(birthdate)) {
      setErrorMessage('Por favor, verifica tus datos.');
      setErrorModalVisible(true);
      return;
    }

    try {
      // Llamada al servicio de registro y manejo de la respuesta.
        const response = await AuthService.register(email, name, birthdate, dni);
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false); // Oculta el modal antes de navegar
          navigation.navigate('Login');
        }, 3000); // Espera 3 segundos antes de redirigir
      } catch (error) {
        setErrorMessage(error.message || 'Error en el registro');
        setErrorModalVisible(true);
      }
    };
// Renderiza los elementos de la interfaz de usuario.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput label="Correo Electrónico" value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
      <TextInput label="Nombre Completo" value={name} onChangeText={(text) => setName(text)} style={styles.input} />
      <TextInput label="Fecha de Nacimiento (dd-mm-aaaa)" value={birthdate} onChangeText={(text) => setBirthdate(formatearFecha(text))} style={styles.input} />
      <TextInput label="RUT (12.345.678-9)" value={dni} onChangeText={(text) => setDni(formatearRut(text))} style={styles.input} />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>Registrarse</Button>

      <Portal>
        <Modal visible={errorModalVisible} onDismiss={() => setErrorModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text>Error</Text>
            <Text>{errorMessage}</Text>
            <Button onPress={() => setErrorModalVisible(false)}>Cerrar</Button>
          </View>
        </Modal>
        <Modal visible={successModalVisible}>
          <View style={styles.modalContent}>
            <Text>Usuario registrado con éxito</Text>
            <Text>Serás redirigido al inicio de sesión.</Text>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};
// Estilos para los elementos de la pantalla.
const styles = StyleSheet.create({
  container: {
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