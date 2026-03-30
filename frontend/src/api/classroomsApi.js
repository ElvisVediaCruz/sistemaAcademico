import axiosClient from './axiosClient';

export const getClassrooms    = ()     => axiosClient.get('/aula/listar');
export const getClassroom     = (id)   => axiosClient.get(`/aula/${id}`);
export const createClassroom  = (data) => axiosClient.post('/aula/crear', data);
export const updateClassroom  = (data) => axiosClient.put('/aula/actualizar', data);
export const deleteClassroom  = (id)   => axiosClient.delete(`/aula/${id}`);
// Aulas asignadas a un docente — usado por el rol 'docente' para restringir su vista
// id = ci_docente (PK del modelo Docente, viene del JWT como user.id)
// Endpoint propio: GET /aula/asignadas/:id_docente
export const getClassroomsAsigned = (id) => axiosClient.get(`/aula/asignadas/${id}`);
