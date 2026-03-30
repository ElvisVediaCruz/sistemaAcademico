import axiosClient from './axiosClient';

// Crea asignación Aula-Docente-Materia — Payload: { id_aula, id_docente, id_materia }
export const assignTeacherSubject  = (data) => axiosClient.post('/docentemateria/crear', data);
export const updateTeacherSubject  = (data) => axiosClient.put('/docentemateria/actualizar', data);
// Lista TODAS las asignaciones con datos de aula, docente y materia (uso admin)
export const getAssignments        = ()     => axiosClient.get('/docentemateria/listar');
// Lista las asignaciones de un aula específica
export const getAssignmentsByAula  = (id)   => axiosClient.get(`/docentemateria/aula/${id}`);
export const deleteAssignment      = (id)   => axiosClient.delete(`/docentemateria/${id}`);
// Asignaciones de UN docente — usado por el rol 'docente' para obtener sus aulas y materias
// id_docente = ci_docente del JWT (user.id)
// Respuesta: DocenteMateria[] con id_aula, materia.id_materia, materia.nombre (flat Sequelize)
export const getAssignmentsClass   = (id_docente) => axiosClient.get(`/docentemateria/asignadas/${id_docente}`);
