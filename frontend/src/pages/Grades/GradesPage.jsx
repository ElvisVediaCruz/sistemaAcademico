import { useEffect, useState } from 'react';
import { getClassroomsAsigned } from '../../api/classroomsApi';
import { getAssignmentsClass } from '../../api/docenteMateriaApi';
import { getStudentsByAula } from '../../api/studentsApi';
import { createNota, updateNota, getNotasByMateria, deleteNota } from '../../api/notaApi';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

export default function GradesPage() {
  // user = payload del JWT { id (= ci_docente), rol }
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  // allAssignments = registros DocenteMateria del docente
  const [allAssignments, setAllAssignments] = useState([]);
  const [selectedAula, setSelectedAula] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [students, setStudents] = useState([]);     // estudiantes del aula seleccionada
  const [notas, setNotas] = useState([]);           // notas existentes para la materia
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal para crear/editar nota de un estudiante
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null); // nota existente (edición) o null (creación)
  const [form, setForm] = useState({ valor: '', fecha: '', descripcion: '' });
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    Promise.all([
      getClassroomsAsigned(user.id),
      getAssignmentsClass(user.id),
    ])
      .then(([cRes, aRes]) => {
        setClassrooms(cRes.data?.data ?? []);
        setAllAssignments(aRes.data?.data ?? []);
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [user.id]);

  // Materias que el docente tiene asignadas en el aula seleccionada
  const subjectsForAula = selectedAula
    ? allAssignments.filter((a) => Number(a.id_aula) === Number(selectedAula))
    : [];

  const handleAulaChange = (id_aula) => {
    setSelectedAula(id_aula);
    setSelectedMateria('');
    setStudents([]);
    setNotas([]);
  };

  const handleMateriaChange = async (id_materia) => {
    setSelectedMateria(id_materia);
    setStudents([]);
    setNotas([]);
    if (!id_materia) return;
    setLoadingStudents(true);
    try {
      const [eRes, nRes] = await Promise.all([
        getStudentsByAula(selectedAula),
        getNotasByMateria(id_materia),
      ]);
      setStudents(eRes.data?.data ?? []);
      setNotas(nRes.data?.data ?? []);
    } catch {
      setError('Error al cargar estudiantes');
    } finally {
      setLoadingStudents(false);
    }
  };

  const getNotaEstudiante = (ci_estudiante) =>
    notas.find((n) => Number(n.id_estudiante) === Number(ci_estudiante)) ?? null;

  const openModal = (student, notaExistente) => {
    setCurrentStudent(student);
    setEditingNota(notaExistente ?? null);
    setForm({
      valor:      notaExistente?.valor ?? '',
      fecha:      notaExistente?.fecha ?? new Date().toISOString().slice(0, 10),
      descripcion: notaExistente?.descripcion ?? '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingNota) {
        // Actualizar nota existente
        await updateNota({
          id:          editingNota.id_nota,
          valor:       Number(form.valor),
          fecha:       form.fecha,
          descripcion: form.descripcion,
        });
        setSuccess('Nota actualizada');
      } else {
        // Crear nueva nota — el docente no puede asignar notas a estudiantes
        // de aulas/materias que no le correspondan porque el selector
        // solo muestra sus asignaciones (filtradas por ci_docente en JWT)
        await createNota({
          id_estudiante: currentStudent.ci_estudiante,
          id_materia:    Number(selectedMateria),
          id_docente:    Number(user.id),
          valor:         Number(form.valor),
          fecha:         form.fecha,
          descripcion:   form.descripcion,
        });
        setSuccess('Nota registrada');
      }
      setModalOpen(false);
      // Recargar notas de la materia
      const nRes = await getNotasByMateria(selectedMateria);
      setNotas(nRes.data?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar nota');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id_nota) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    setDeletingId(id_nota);
    try {
      await deleteNota(id_nota);
      setSuccess('Nota eliminada');
      setNotas((prev) => prev.filter((n) => n.id_nota !== id_nota));
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  const selectedMateriaName =
    subjectsForAula.find((a) => Number(a['materia.id_materia']) === Number(selectedMateria))?.['materia.nombre'] ?? '';

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calificaciones</h1>
        <p className="text-gray-500 mt-1">Registra notas de tus materias asignadas</p>
      </div>

      {error && <Alert message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Selectores de aula y materia */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select
              value={selectedMateria}
              disabled={!selectedAula}
              onChange={(e) => handleMateriaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {selectedAula ? 'Seleccionar materia' : 'Primero selecciona un aula'}
              </option>
              {/* Solo las materias asignadas al docente en el aula seleccionada */}
              {subjectsForAula.map((a) => (
                <option key={a['materia.id_materia']} value={a['materia.id_materia']}>
                  {a['materia.nombre']}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de estudiantes y notas */}
      {loadingStudents ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {selectedMateriaName} — {students.length} estudiantes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">CI Estudiante</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nota</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s, idx) => {
                  const nota = getNotaEstudiante(s.ci_estudiante);
                  return (
                    <tr key={s.ci_estudiante ?? idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{s.ci_estudiante}</td>
                      <td className="px-4 py-3">
                        {`${s.nombre} ${s.apellidos}`}
                      </td>
                      <td className="px-4 py-3">
                        {nota ? (
                          <span className={`font-semibold ${Number(nota.valor) >= 10 ? 'text-green-600' : 'text-red-500'}`}>
                            {nota.valor}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Sin nota</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {nota?.fecha ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {nota ? (
                            <>
                              <Button size="sm" variant="secondary" onClick={() => openModal(s, nota)}>
                                Editar
                              </Button>
                              <Button
                                size="sm" variant="danger"
                                disabled={deletingId === nota.id_nota}
                                onClick={() => handleDelete(nota.id_nota)}
                              >
                                Eliminar
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" onClick={() => openModal(s, null)}>
                              + Nota
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedMateria ? (
        <div className="text-center py-8 text-gray-400">
          No hay estudiantes inscritos en esta materia
        </div>
      ) : null}

      {/* Modal crear/editar nota */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNota ? 'Editar Nota' : 'Registrar Nota'}
      >
        {error && <Alert message={error} onClose={() => setError('')} />}
        {currentStudent && (
          <p className="text-sm text-gray-600 mb-4">
            Estudiante: <strong>{`${currentStudent.nombre} ${currentStudent.apellidos}`}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (nota)</label>
              <input
                type="number" required min="0" max="20" step="0.01"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="0 – 20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date" required
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
            <input
              type="text"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Ej: Examen parcial, Tarea 1..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
