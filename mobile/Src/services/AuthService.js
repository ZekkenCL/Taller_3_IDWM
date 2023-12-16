import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:5000/';

// Función para iniciar sesión
const login = async (email, password) => {
  try {
    // Realiza una solicitud POST para autenticar al usuario
    const response = await axios.post(`${API_URL}login`, { email, password });
    return response.data;
  } catch (error) {
    // Manejo de errores dependiendo de la naturaleza del error
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

// Función para registrar un nuevo usuario
const register = async (email, name, birthdate, dni) => {
    try {
      // Realiza una solicitud POST para registrar un usuario
      const response = await axios.post(`${API_URL}register`, {
        email,
        name,
        birthdate,
        dni
      });
      return response.data;
    } catch (error) {
      // Manejo de errores en la solicitud de registro
      if (error.response) {
        throw new Error(error.response.data.message || 'Error en el registro');
      } else {
        throw new Error('Error al conectarse al servidor');
      }
    }
  };
// Función para actualizar el perfil del usuario
  const updateProfile = async (userData, userId, token) => {
    try {
      // Realiza una solicitud PUT para actualizar el perfil del usuario
      const response = await axios.put(`${API_URL}/edit_profile/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Manejo de errores en la actualización del perfil
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };
// Función para obtener los repositorios de un usuario
  const getRepositories = async (username, token) => {
    try {
      // Realiza una solicitud GET para obtener los repositorios
      const response = await axios.get(`${API_URL}repos/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const repos = response.data;
      // Obtiene el conteo de commits para cada repositorio
      const reposWithCommits = await Promise.all(repos.map(async repo => {
        const commitCount = await getCommitsCount(username, repo.name, token);
        return { ...repo, commitCount };
      }));
      return reposWithCommits;
    } catch (error) {
      // Manejo de errores en la obtención de repositorios
      console.error('Error al obtener repositorios:', error);
      throw error;
    }
  };
// Función para contar los commits de un repositorio
  const getCommitsCount = async (username, repoName, token) => {
    try {
      // Realiza una solicitud GET para obtener los commits de un repositorio
      const response = await axios.get(`${API_URL}repos/${username}/${repoName}/commits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.length;
    } catch (error) {
      // Manejo de errores en la obtención de commits
      console.error('Error al obtener commits:', error);
      throw error;
    }
  };
// Función para actualizar la contraseña del usuario
  const updatePassword = async (userData, token) => {
    try {
      // Realiza una solicitud PUT para cambiar la contraseña
      const response = await axios.put(`${API_URL}/update_password`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Manejo de errores en la actualización de contraseña
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  };
// Función para obtener los detalles de los commits de un repositorio
  const getCommits = async (username, repoName, token) => {
    try {
      // Realiza una solicitud GET para obtener detalles de los commits
      const response = await axios.get(`${API_URL}repos/${username}/${repoName}/commits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      // Manejo de errores en la obtención de detalles de commits
      console.error('Error al obtener detalles de commits:', error);
      throw error;
    }
  };
  
// Exportación de todas las funciones como un módulo
export default {
    login,
    register,
    updateProfile,
    getRepositories,
    getCommitsCount,
    updatePassword,
    getCommits
};
