import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const getUsuarios = () => api.get('/tutorias');

export const login = (correo, contrasena) =>
  api.post('/login', { correo, contrasena });

export const register = (userData) =>
  api.post('/tutorias', userData);

export const buscarTutoresPorNombre = (busqueda) =>
  api.get(`/tutorias/tutores/nombre?busqueda=${encodeURIComponent(busqueda)}`);

export const filtrarTutoresPorRating = (minRating) =>
  api.get(`/tutorias/tutores/rating?minRating=${minRating}`);

export const filtrarTutoresPorPrecio = (maxPrecio) =>
  api.get(`/tutorias/tutores/precio?maxPrecio=${maxPrecio}`);

export const filtrarTutoresPorModalidad = (modalidad) =>
  api.get(`/tutorias/tutores/modalidad/${modalidad}`);

export default api;
