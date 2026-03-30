import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudents } from '../../api/studentsApi';
import { getTeachers } from '../../api/teachersApi';
import { getClassrooms } from '../../api/classroomsApi';
import { getSubjects } from '../../api/subjectsApi';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin, isTeacher } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, classrooms: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }

    Promise.allSettled([
      getStudents(),
      getTeachers(),
      getClassrooms(),
      getSubjects(),
    ]).then(([s, t, c, m]) => {
      setStats({
        students: s.value?.data?.data?.length ?? s.value?.data?.result?.length ?? 0,
        teachers: t.value?.data?.result?.length ?? 0,
        classrooms: c.value?.data?.data?.length ?? 0,
        subjects: m.value?.data?.data?.length ?? 0,
      });
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.username ?? 'Usuario'} 👋
        </h1>
        <p className="text-gray-500 mt-1 capitalize">Panel de {user?.rol}</p>
      </div>

      {isAdmin && (
        <>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumen del sistema</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="👨‍🎓" label="Estudiantes" value={stats.students} color="bg-blue-50" />
              <StatCard icon="👨‍🏫" label="Docentes" value={stats.teachers} color="bg-green-50" />
              <StatCard icon="🏫" label="Aulas" value={stats.classrooms} color="bg-yellow-50" />
              <StatCard icon="📚" label="Materias" value={stats.subjects} color="bg-purple-50" />
            </div>
          )}
        </>
      )}

      {isTeacher && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Acciones rápidas</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Tomar asistencia de hoy</p>
              <p>📋 Ver historial de asistencia</p>
              <p>👥 Ver lista de estudiantes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
