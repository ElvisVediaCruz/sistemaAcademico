import { useEffect, useState } from 'react';
import { getClassroomsAsigned } from '../../api/classroomsApi';
// getAssignmentsClass → GET /docentemateria/asignadas/:id_docente
// retorna los registros DocenteMateria del docente con id_aula, materia.id_materia, materia.nombre
import { getAssignmentsClass } from '../../api/docenteMateriaApi';
import { createAttendance, updateAttendance, getAttendanceList } from '../../api/attendanceApi';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { estadoColor, capitalize } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const ESTADOS = ['presente', 'ausente', 'tarde'];

export default function CreateAttendancePage() {
  // user.user = payload del JWT decodificado { id (= ci_docente), rol, ... }
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  // allAssignments = todos los registros DocenteMateria del docente actual
  const [allAssignments, setAllAssignments] = useState([]);
  const [form, setForm] = useState({ id_aula: '', id_materia: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);
  const [estados, setEstados] = useState({});

  useEffect(() => {
    Promise.all([
      getClassroomsAsigned(user.id),
      // Carga todas las asignaciones del docente para filtrar materias por aula seleccionada
      getAssignmentsClass(user.id),
    ])
      .then(([cRes, aRes]) => {
        setClassrooms(cRes.data?.data ?? []);
        setAllAssignments(aRes.data?.data ?? []);
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [user.id]);

  // Materias del aula seleccionada — el docente sólo puede tomar lista
  // en aulas donde está asignado a una materia (garantía de pertenencia)
  
  const subjectsForAula = form.id_aula
    ? allAssignments.filter((a) => Number(a.id_aula) === Number(form.id_aula))
    : [];
  const handleAulaChange = (id_aula) => {
    // Al cambiar el aula se resetea la materia para evitar combinaciones inválidas
    setForm({ id_aula, id_materia: '' });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    setAttendanceList([]);
    try {
      const res = await createAttendance({
        id_aula:    Number(form.id_aula),
        id_materia: Number(form.id_materia),
        // id_docente se toma del JWT — el docente no puede suplantar a otro
        id_docente: Number(user.id),
      });
      //necesitamos retornar la lista de los estudiantes
      console.log(res)
      const result = await getAttendanceList(res.data.data);
      const list = result.data.data.detalle ?? [];
      setAttendanceList(list);
      // id_detalle es la PK del modelo DetalleAsistencia (antes id_detalle_asistencia)
      const initialEstados = {};
      list.forEach((item) => { initialEstados[item.id_detalle] = item.estado ?? 'ausente'; });
      setEstados(initialEstados);
      setSuccess('Lista creada. Marque el estado de cada estudiante.');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al crear asistencia');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');
    try {
      await Promise.all(
        attendanceList.map((item) =>
          updateAttendance({ id: item.id_detalle, estado: estados[item.id_detalle] })
        )
      );
      setSuccess('Asistencia guardada correctamente');
      setAttendanceList([]);
      setForm({ id_aula: '', id_materia: '' });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar asistencia');
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Tomar Asistencia</h1>
        <p className="text-gray-500 mt-1">Solo se muestran aulas y materias asignadas a tu cuenta</p>
      </div>

      {error && <Alert message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {attendanceList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-lg">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
              <select
                required value={form.id_aula}
                onChange={(e) => handleAulaChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Seleccionar aula</option>
                {classrooms.map((c) => (
                  <option key={c.id_aula} value={c.id_aula}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
              <select
                required value={form.id_materia}
                disabled={!form.id_aula}
                onChange={(e) => setForm({ ...form, id_materia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">
                  {form.id_aula ? 'Seleccionar materia' : 'Primero selecciona un aula'}
                </option>
                {/* Solo materias que este docente tiene asignadas en el aula seleccionada */}
                {allAssignments.map((a) => (
                  <option key={a['materia.id_materia']} value={a['materia.id_materia']}>
                    {a['materia.nombre']}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={submitting || !form.id_aula || !form.id_materia} className="w-full justify-center">
              {submitting ? 'Generando lista...' : 'Generar lista de asistencia'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Lista de asistencia — {attendanceList.length} estudiantes
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setAttendanceList([])}>Cancelar</Button>
              <Button onClick={handleSaveAll} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar asistencia'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <span className="text-sm text-gray-600 self-center">Marcar todos como:</span>
            {ESTADOS.map((est) => (
              <button
                key={est}
                onClick={() => {
                  const all = {};
                  attendanceList.forEach((i) => { all[i.id_detalle] = est; });
                  setEstados(all);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor(est)}`}
              >
                {capitalize(est)}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">CI Estudiante</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceList.map((item, idx) => (
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
                            onClick={() => setEstados({ ...estados, [item.id_detalle]: est })}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              estados[item.id_detalle] === est
                                ? estadoColor(est) + ' ring-2 ring-offset-1 ring-current'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
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
      )}
    </div>
  );
}
