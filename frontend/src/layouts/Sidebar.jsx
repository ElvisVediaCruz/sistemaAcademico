import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/students', label: 'Estudiantes', icon: '👨‍🎓' },
  { to: '/teachers', label: 'Docentes', icon: '👨‍🏫' },
  { to: '/classrooms', label: 'Aulas', icon: '🏫' },
  { to: '/subjects', label: 'Materias', icon: '📚' },
  { to: '/assignments', label: 'Asignaciones', icon: '📋' },
  { to: '/reports', label: 'Reportes', icon: '📊' },
];

const teacherNav = [
  { to: '/dashboard',          label: 'Dashboard',       icon: '🏠' },
  { to: '/attendance/create',  label: 'Tomar Asistencia', icon: '✅' },
  { to: '/attendance/history', label: 'Historial',        icon: '📋' },
  { to: '/grades',             label: 'Calificaciones',   icon: '📝' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const nav = isAdmin ? adminNav : teacherNav;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-auto lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-indigo-400">SAB</h1>
          <p className="text-xs text-gray-400 mt-0.5">Sistema Académico</p>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-sm font-medium truncate">{user?.username ?? 'Usuario'}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 capitalize">
            {user?.rol ?? ''}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
