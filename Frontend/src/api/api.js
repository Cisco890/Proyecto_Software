import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const getUsuarios = () => api.get('/tutorias');

export const login = (correo, contrasena) =>
  api.post('/login', { correo, contrasena });

export const register = (userData) =>
  api.post('/tutorias', userData);

export default api;
