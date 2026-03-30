import axiosClient from './axiosClient';

export const getSubjects  = ()     => axiosClient.get('/materia/listar');
export const getSubject   = (id)   => axiosClient.get(`/materia/${id}`);
export const createSubject = (data) => axiosClient.post('/materia/crear', data);
export const updateSubject = (data) => axiosClient.put('/materia/actualizar', data);
export const deleteSubject = (id)   => axiosClient.delete(`/materia/${id}`);
