import axiosClient from './axiosClient';

// Crea lista de asistencia para todos los alumnos del aula en estado "ausente"
// Payload: { id_aula, id_materia, id_docente }
export const createAttendance     = (data) => axiosClient.post('/asistencia/crear', data);
// Actualiza el estado de un detalle (presente/ausente/tarde)
// Payload: { id, estado }  —  id = id_detalle (PK renombrado del nuevo modelo)
export const updateAttendance     = (data) => axiosClient.put('/asistencia/actualizar', data);
// Obtiene una lista con sus detalles y datos del estudiante
export const getAttendanceList    = (id)   => axiosClient.get(`/asistencia/lista/${id}`);
// Obtiene todas las listas de asistencia de un aula
export const getAttendanceByAula  = (id)   => axiosClient.get(`/asistencia/aula/${id}`);
// Obtiene todas las listas de asistencia tomadas por un docente
export const getAttendanceByDocente = (id) => axiosClient.get(`/asistencia/docente/${id}`);
