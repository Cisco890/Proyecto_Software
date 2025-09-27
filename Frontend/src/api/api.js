import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Autenticación
export const login = (correo, contrasena) =>
  api.post("/login", { correo, contrasena });

export const register = (userData) => api.post("/tutorias/registro", userData);

// Usuarios
export const getUsuarios = () => api.get("/tutorias");

export const getEstudiantes = () => api.get("/tutorias/usuarios/estudiantes");

// Perfiles
export const crearPerfil = (nombre) =>
  api.post("/tutorias/perfiles", { nombre });

// Información del tutor
export const crearInfoTutor = (tutorData) =>
  api.post("/tutorias/tutores/info", tutorData);

export const obtenerInfoTutor = (idUsuario) =>
  api.get(`/tutorias/tutores/info/usuario/${idUsuario}`);

export const obtenerDescripcionDelTutor = (idTutor) =>
  api.get(`/tutorias/tutores/${idTutor}/descripcion`);

export const obtenerMetodologiaDelTutor = (idTutor) =>
  api.get(`/tutorias/tutores/${idTutor}/metodologia`);

export const obtenerTutoriasDelTutor = (idTutor) =>
  api.get(`/tutorias/tutores/${idTutor}/tutorias`);

export const obtenerRatingDelTutor = (id) =>
  api.get(`/tutorias/tutores/${id}/rating`);

export const obtenerSesionesDelTutor = (id) =>
  api.get(`/tutorias/tutores/${id}/sesiones`);

// Calificaciones
export const calificarTutor = (calificacionData) =>
  api.post("/tutorias/calificaciones", calificacionData);

// Filtros
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

export const filtrarTutoresPorFranjaHoraria = (horario) =>
  api.get(`/tutorias/horarios/${horario}`);

export default api;

// Citas / Sesiones

// Obtener disponibilidad de bloques ocupados del tutor
export const getDisponibilidadTutor = (idTutor) =>
  api.get(`/citas/disponibilidad/${idTutor}`);

// Crear una nueva cita
export const agendarCita = (data) => api.post("/citas", data);

// Lista sesiones por usuario
export function getUserSessions({ userId, rol, estado, futuras }) {
  const params = {};
  if (rol) params.rol = rol;
  if (estado) params.estado = estado;
  if (typeof futuras !== "undefined") params.futuras = futuras ? "true" : "false";
  return api.get(`/citas/usuarios/${userId}/sesiones`, { params });
}

// Cambiar estado
export function updateSessionStatus(idSesion, estado) {
  return api.put(`/citas/sesiones/${idSesion}/estado`, { estado });
}

// 🔹 Pendientes del tutor (futuras)
export function getTutorPendingSessions(tutorId) {
  return api.get(`/citas/usuarios/${tutorId}/sesiones`, {
    params: { rol: "tutor", estado: "pendiente", futuras: "true" },
  });
}