import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
      >
        <span className="text-xl">☰</span>
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.username}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.username?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
}
