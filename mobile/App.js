import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './Src/context/AuthContext';

import HomeScreen from './Src/screens/HomeScreen';
import LoginScreen from './Src/screens/LoginScreen';
import RegisterScreen from './Src/screens/RegisterScreen';
import MenuPrincipalScreen from './Src/screens/MenuPrincipalScreen';
import EditarPerfilScreen from './Src/screens/EditarPerfilScreen';
import RepositoriesScreen from './Src/screens/RepositoriesScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Bienvenido' }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Iniciar Sesión' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Registrarse' }}
            />
            <Stack.Screen
              name="MenuPrincipal"
              component={MenuPrincipalScreen}
              options={{ headerLeft: () => null }} 
            />
            <Stack.Screen
              name="EditarPerfil"
              component={EditarPerfilScreen}
              options={{ title: 'Editar Perfil' }}
            />
            <Stack.Screen
              name="VerRepositorios"
              component={RepositoriesScreen}
              options={{ title: 'Ver Repositorios' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}

export default App;
