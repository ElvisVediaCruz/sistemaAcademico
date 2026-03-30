import axiosClient from './axiosClient';

// Requiere JWT — el axiosClient lo inyecta automáticamente desde localStorage
export const getTeachers       = ()     => axiosClient.get('/docente/listar');
// ci = ci_docente (PK del nuevo modelo)
export const getTeacher        = (ci)   => axiosClient.get(`/docente/${ci}`);
export const createTeacher     = (data) => axiosClient.post('/docente/crear', data);
export const updateTeacher     = (data) => axiosClient.put('/docente/actualizar', data);
export const deleteTeacher     = (ci)   => axiosClient.delete(`/docente/${ci}`);
// Devuelve docentes que ya tienen materias asignadas (via DocenteMateria)
// El backend retorna: [{ ci_docente, nombre, apellidos, materia: [...] }]
export const docentesAsignados = ()     => axiosClient.get('/docente/asignados');
// Busca o crea la lista de asistencia para la clase actual del docente autenticado
export const llamarLista       = (data) => axiosClient.post('/docente/lista', data);
