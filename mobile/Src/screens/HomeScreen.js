import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';


// Componente de pantalla de inicio.
const HomeScreen = ({ navigation }) => {

  // Renderiza los elementos de la interfaz, incluyendo una imagen y botones para iniciar sesión o registrarse.
  return (
    <View style={styles.container}>
      <Image 
        source={require('/assets/MobileHub.png')} 
        style={styles.logo} 
      />

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, styles.buttonMargin]}
        >
          Iniciar sesión
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        >
          Registrarse
        </Button>
      </View>
    </View>
  );
};
// Estilos para la pantalla.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  buttonMargin: {
    marginBottom: 20,
  },
});

export default HomeScreen;
