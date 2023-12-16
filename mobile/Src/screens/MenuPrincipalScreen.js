import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const MenuPrincipalScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default MenuPrincipalScreen;
