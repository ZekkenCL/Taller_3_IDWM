import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

// Componente de pantalla del menú principal.
const MenuPrincipalScreen = ({ navigation }) => {
  // Extrae el usuario y la función de cierre de sesión del contexto
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

   // Renderiza los elementos de la interfaz de usuario.
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{user.name}</Title>
          <Paragraph>Email: {user.email}</Paragraph>
          <Paragraph>Fecha de Nacimiento: {user.birthdate}</Paragraph>
        </Card.Content>
      </Card>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditarPerfil')}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditarContraseña')}>
          <Text style={styles.buttonText}>Editar Contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('VerRepositorios')}>
          <Text style={styles.buttonText}>Ver Repositorios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => {
            logout();
            navigation.navigate('Login');
          }}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos para los elementos de la pantalla.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:10,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoutContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    margin: 10,
  },

});

export default MenuPrincipalScreen;
