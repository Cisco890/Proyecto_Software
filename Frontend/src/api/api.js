import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const getUsuarios = () => api.get('/tutorias');

export const login = (correo, contrasena) =>
  api.post('/login', { correo, contrasena });

export const register = (userData) =>
  api.post('/tutorias/registro', userData);

export const buscarTutoresPorNombre = (busqueda) =>
  api.get(`/tutorias/tutores/nombre?busqueda=${encodeURIComponent(busqueda)}`);

export const filtrarTutoresPorRating = (minRating) =>
  api.get(`/tutorias/tutores/rating?minRating=${minRating}`);

export const filtrarTutoresPorPrecio = (maxPrecio) =>
  api.get(`/tutorias/tutores/precio?maxPrecio=${maxPrecio}`);

export const filtrarTutoresPorModalidad = (modalidad) =>
  api.get(`/tutorias/tutores/modalidad/${modalidad}`);

export const filtrarTutoresPorMateria = (idMateria) =>
  api.get(`/tutorias/tutores/materia/${idMateria}`);

export const filtrarTutoresPorHora = (hora) =>
  api.get(`/tutorias/tutores/horario/${hora}`);

export const filtrarTutoresPorExperiencia = (minExperiencia) =>
  api.get(`/tutorias/tutores/experiencia?minExperiencia=${minExperiencia}`);

export default api;
