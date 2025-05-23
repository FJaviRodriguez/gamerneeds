import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const loginUsuario = async (formData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Credenciales inválidas'
      };
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
    }
    return {
      success: true,
      usuario: data.usuario,
      token: data.token
    };
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};
export const registroUsuario = async (datosUsuario) => {
  try {
    const respuesta = await api.post('/auth/register', datosUsuario);
    return respuesta.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error.response?.data || { message: 'Error de comunicación con el servidor' };
  }
};
export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const estaAutenticado = () => {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('user');
  return !!(token && usuario);
};
export const obtenerToken = () => {
  return localStorage.getItem('token');
};
export const obtenerUsuarioActual = () => {
  const usuario = localStorage.getItem('user');
  return usuario ? JSON.parse(usuario) : null;
};
export const validarToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;  
    const response = await api.get('/auth/validate-token');
    return response.data.valid;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
};