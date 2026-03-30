import { useEffect, useState } from 'react';
import { getClassrooms } from '../../api/classroomsApi';
import { getTeachers } from '../../api/teachersApi';
import { getSubjects } from '../../api/subjectsApi';
// Agregados para consultar asistencia real según filtros
import { getAttendanceByAula, getAttendanceByDocente } from '../../api/attendanceApi';
import { estadoColor, capitalize } from '../../utils/formatters';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function ReportsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // ci_docente es la PK del modelo Docente — el filtro ahora usa ci_docente
  const [filters, setFilters] = useState({ id_aula: '', ci_docente: '' });
  const [attendanceLists, setAttendanceLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getClassrooms(), getTeachers(), getSubjects()])
      .then(([c, t, s]) => {
        setClassrooms(c.data?.data ?? []);
        // Docente controller responde { message, result, okey }
        setTeachers(t.data?.result ?? []);
        setSubjects(s.data?.data ?? []);
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!filters.id_aula && !filters.ci_docente) return;
    setSearching(true);
    setError('');
    try {
      let res;
      if (filters.id_aula) {
        // getAttendanceByAula — retorna todas las listas del aula
        res = await getAttendanceByAula(filters.id_aula);
      } else {
        // getAttendanceByDocente — retorna todas las listas tomadas por el docente
        res = await getAttendanceByDocente(filters.ci_docente);
      }
      setAttendanceLists(res.data?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al buscar asistencia');
    } finally {
      setSearching(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportes de Asistencia</h1>
        <p className="text-gray-500 mt-1">Consulta y filtra registros de asistencia</p>
      </div>

      {error && <Alert message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtros</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Aula</label>
            <select
              value={filters.id_aula}
              onChange={(e) => setFilters({ id_aula: e.target.value, ci_docente: '' })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Todas las aulas</option>
              {classrooms.map((c) => (
                <option key={c.id_aula} value={c.id_aula}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Docente</label>
            <select
              value={filters.ci_docente}
              onChange={(e) => setFilters({ id_aula: '', ci_docente: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Todos los docentes</option>
              {/* ci_docente es la PK del modelo Docente (antes id_docente) */}
              {teachers.map((t) => (
                <option key={t.ci_docente} value={t.ci_docente}>{t.nombre} {t.apellidos}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSearch} disabled={searching || (!filters.id_aula && !filters.ci_docente)}>
            {searching ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total aulas', value: classrooms.length },
          { label: 'Total docentes', value: teachers.length },
          { label: 'Total materias', value: subjects.length },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance lists results */}
      {attendanceLists.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Listas encontradas ({attendanceLists.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">ID Lista</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Aula</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Materia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceLists.map((l) => (
                  // id_lista es la PK renombrada de ListaAsistencia (antes id_lista_asistencia)
                  <tr key={l.id_lista} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{l.id_lista}</td>
                    <td className="px-4 py-3">{l.Aula?.nombre ?? l.id_aula ?? '—'}</td>
                    <td className="px-4 py-3">{l.Materia?.nombre ?? l.id_materia ?? '—'}</td>
                    <td className="px-4 py-3">{l.createdAt?.slice(0, 10) ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-400">
          <p className="mt-2">Selecciona un aula o docente y presiona Buscar para ver los registros de asistencia.</p>
        </div>
      )}
    </div>
  );
}
