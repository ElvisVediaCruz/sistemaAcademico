export const ROLES = {
  ADMIN: 'administrador',
  TEACHER: 'docente',
};

export const hasRole = (user, role) => user?.rol === role;

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isTeacher = (user) => hasRole(user, ROLES.TEACHER);
