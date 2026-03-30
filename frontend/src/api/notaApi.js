import axiosClient from './axiosClient';

// Payload: { id_estudiante, id_materia, id_docente (opcional), valor, fecha, descripcion (opcional) }
export const createNota           = (data) => axiosClient.post('/nota/crear', data);
export const updateNota           = (data) => axiosClient.put('/nota/actualizar', data);
export const getNotas             = ()     => axiosClient.get('/nota/listar');
// ci_estudiante = PK del modelo Estudiante
export const getNotasByEstudiante = (ci)   => axiosClient.get(`/nota/estudiante/${ci}`);
export const getNotasByMateria    = (id)   => axiosClient.get(`/nota/materia/${id}`);
// ci_docente = PK del modelo Docente
export const getNotasByDocente    = (ci)   => axiosClient.get(`/nota/docente/${ci}`);
export const deleteNota           = (id)   => axiosClient.delete(`/nota/${id}`);
