import React, { createContext, useState, useContext } from 'react';

// Crea un contexto de autenticación, útil para proporcionar y consumir datos de autenticación en toda la aplicación.
export const AuthContext = createContext();

// Componente proveedor que envuelve la aplicación o partes de ella para proporcionar un contexto de autenticación.
export const AuthProvider = ({ children }) => {
  // Estado para almacenar la información del usuario actual y su token de autenticación.
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Función para manejar el inicio de sesión. Establece los datos del usuario y el token en el estado.
  // `userData` es el objeto que contiene la información del usuario.
  // `tokenData` es el token JWT u otro tipo de token de autenticación.
  const login = (userData, tokenData) => {
    setUser(userData); // Establece los datos del usuario en el estado.
    setToken(tokenData); // Establece el token en el estado.
  };

  // Función para manejar el cierre de sesión. Limpia el usuario y el token del estado.
  const logout = () => {
    setUser(null); // Elimina los datos del usuario del estado.
    setToken(null); // Elimina el token del estado.
  };

  // El proveedor de contexto pasa el usuario, setUser, token, y las funciones de login y logout al valor del contexto.
  // Esto hace que estos valores estén disponibles para cualquier componente hijo que consuma este contexto.
  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar el consumo del contexto de autenticación en otros componentes.
export const useAuth = () => useContext(AuthContext);
