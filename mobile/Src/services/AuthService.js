// services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      // La solicitud se realizó y el servidor respondió con un estado de error
      throw new Error(error.response.data.message || 'Usuario o contraseña incorrectos');
    } else if (error.request) {
      // La solicitud se realizó, pero no se recibió respuesta
      throw new Error('No se pudo conectar al servidor');
    } else {
      // Algo más causó el error
      throw new Error('Error al iniciar sesión');
    }
  }
};

const register = async (email, name, birthYear, dni) => {
    try {
      const response = await axios.post(`${API_URL}register`, {
        email,
        name,
        birthYear,
        dni
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Error en el registro');
      } else {
        throw new Error('Error al conectarse al servidor');
      }
    }
  };

export default {
  login,
    register,
};
