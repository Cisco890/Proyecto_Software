import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
});

export const getUsuarios = () => api.get('/tutorias');

export const login = (correo, contrasena) =>
  api.post('/login/login', { correo, contrasena });

export default api;
