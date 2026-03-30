import { useEffect, useState } from 'react';
import { getClassroomsAsigned } from '../../api/classroomsApi';
import { getAssignmentsClass } from '../../api/docenteMateriaApi';
// getAttendanceByAula → listas de un aula; getAttendanceList → detalles de una lista
import { updateAttendance, getAttendanceByAula, getAttendanceList } from '../../api/attendanceApi';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { estadoColor, capitalize } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const ESTADOS = ['presente', 'ausente', 'tarde'];

export default function AttendanceHistoryPage() {
  // user.user = payload del JWT { id (= ci_docente), rol }
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [selectedAula, setSelectedAula] = useState('');
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      getClassroomsAsigned(user.id),
      getAssignmentsClass(user.id),
    ])
      .then(([cRes, aRes]) => {
        setClassrooms(cRes.data?.data ?? []);
        setAllAssignments(aRes.data?.data ?? []);
      })
      .catch(() => setError('Error al cargar aulas'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleAulaChange = async (id_aula) => {
    setSelectedAula(id_aula);
    setSelectedList('');
    setDetails([]);
    setLists([]);
    if (!id_aula) return;
    setLoadingLists(true);
    try {
      const res = await getAttendanceByAula(id_aula);
      const all = res.data?.data ?? [];
      // Filtrar: el docente solo ve sus propias listas de asistencia, no las de otros docentes
      const mine = all.filter((l) => Number(l.id_docente) === Number(user.id));
      setLists(mine);
    } catch {
      setError('Error al cargar listas del aula');
    } finally {
      setLoadingLists(false);
    }
  };

  const handleListChange = async (id_lista) => {
    setSelectedList(id_lista);
    setDetails([]);
    if (!id_lista) return;
    setLoadingDetails(true);
    try {
      const res = await getAttendanceList(id_lista);
      const lista = res.data?.data ?? res.data ?? {};
      setDetails(lista.DetalleAsistencia ?? lista.detalle ?? []);
    } catch {
      setError('Error al cargar detalles de la lista');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdate = async (id_detalle, estado) => {
    setSaving(id_detalle);
    setError('');
    try {
      await updateAttendance({ id: id_detalle, estado });
      setDetails((prev) =>
        prev.map((d) => d.id_detalle === id_detalle ? { ...d, estado } : d)
      );
      setSuccess('Estado actualizado');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al actualizar');
    } finally {
      setSaving(null);
    }
  };

  // Materias asignadas en el aula seleccionada (para mostrar nombre de la lista)
  const subjectsForAula = selectedAula
    ? allAssignments.filter((a) => Number(a.id_aula) === Number(selectedAula))
    : [];
  const subjectName = (id_materia) =>
    subjectsForAula.find((a) => Number(a['materia.id_materia']) === Number(id_materia))?.['materia.nombre'] ?? `Materia #${id_materia}`;

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Asistencia</h1>
        <p className="text-gray-500 mt-1">Solo se muestran listas tomadas por tu cuenta</p>
      </div>

      {error && <Alert message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
            <select
              value={selectedAula}
              onChange={(e) => handleAulaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Seleccionar aula</option>
              {classrooms.map((c) => (
                <option key={c.id_aula} value={c.id_aula}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {selectedAula && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lista de asistencia</label>
              {loadingLists ? (
                <p className="text-sm text-gray-500">Cargando listas...</p>
              ) : lists.length === 0 ? (
                <p className="text-sm text-gray-400">No hay listas registradas para esta aula</p>
              ) : (
                <select
                  value={selectedList}
                  onChange={(e) => handleListChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Seleccionar lista</option>
                  {lists.map((l) => (
                    <option key={l.id_lista} value={l.id_lista}>
                      Lista #{l.id_lista} — {subjectName(l.id_materia)} — {l.createdAt?.slice(0, 10) ?? ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {loadingDetails ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : details.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            {details.length} estudiantes
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">CI</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {details.map((item, idx) => (
                  <tr key={item.id_detalle} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.id_estudiante}</td>
                    <td className="px-4 py-3">
                      {item.estudiante
                        ? `${item.estudiante.nombre} ${item.estudiante.apellidos}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {ESTADOS.map((est) => (
                          <button
                            key={est}
                            disabled={saving === item.id_detalle}
                            onClick={() => handleUpdate(item.id_detalle, est)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              item.estado === est
                                ? estadoColor(est) + ' ring-2 ring-offset-1 ring-current'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            } disabled:opacity-50`}
                          >
                            {capitalize(est)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedList ? (
        <div className="text-center py-8 text-gray-400">Sin detalles en esta lista</div>
      ) : null}
    </div>
  );
}
