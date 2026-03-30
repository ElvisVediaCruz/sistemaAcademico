import axiosClient from './axiosClient';

export const getStudents       = ()       => axiosClient.get('/estudiante/listar');
// ci = ci_estudiante (PK del nuevo modelo)
export const getStudent        = (ci)     => axiosClient.get(`/estudiante/${ci}`);
export const getStudentsByAula = (id)     => axiosClient.get(`/estudiante/aula/${id}`);
export const createStudent     = (data)   => axiosClient.post('/estudiante/crear', data);
export const updateStudent     = (data)   => axiosClient.put('/estudiante/actualizar', data);
export const deleteStudent     = (ci)     => axiosClient.delete(`/estudiante/${ci}`);
