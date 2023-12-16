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

const register = async (email, name, birthdate, dni) => {
    try {
      const response = await axios.post(`${API_URL}register`, {
        email,
        name,
        birthdate,
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

  const updateProfile = async (userData, userId, token) => {
    try {
      const response = await axios.put(`${API_URL}/edit_profile/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  const getRepositories = async (username, token) => {
    try {
      const response = await axios.get(`${API_URL}repos/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const repos = response.data;
      const reposWithCommits = await Promise.all(repos.map(async repo => {
        const commitCount = await getCommitsCount(username, repo.name, token);
        return { ...repo, commitCount };
      }));
      return reposWithCommits;
    } catch (error) {
      console.error('Error al obtener repositorios:', error);
      throw error;
    }
  };

  const getCommitsCount = async (username, repoName, token) => {
    try {
      const response = await axios.get(`${API_URL}repos/${username}/${repoName}/commits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.length;
    } catch (error) {
      console.error('Error al obtener commits:', error);
      throw error;
    }
  };

  const updatePassword = async (userData, token) => {
    try {
      const response = await axios.put(`${API_URL}/update_password`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  };

  const getCommits = async (username, repoName, token) => {
    try {
      const response = await axios.get(`${API_URL}repos/${username}/${repoName}/commits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles de commits:', error);
      throw error;
    }
  };
  

export default {
    login,
    register,
    updateProfile,
    getRepositories,
    getCommitsCount,
    updatePassword,
    getCommits
};
