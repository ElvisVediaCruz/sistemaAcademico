import { useEffect, useState } from 'react';
import { getTeachers } from '../../api/teachersApi';
import { getSubjects } from '../../api/subjectsApi';
import { getClassrooms } from '../../api/classroomsApi';
// Cambiado de docentesAsignados() a getAssignments() — nuevo endpoint GET /docentemateria/listar
// que retorna todas las asignaciones Aula-Docente-Materia con includes
import { assignTeacherSubject, updateTeacherSubject, getAssignments, deleteAssignment } from '../../api/docenteMateriaApi';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

// DocenteMateria ahora requiere id_aula además de id_docente e id_materia
const EMPTY_FORM = { id_aula: '', id_docente: '', id_materia: '' };

export default function AssignmentsPage() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [tRes, sRes, cRes, aRes] = await Promise.all([
        getTeachers(),
        getSubjects(),
        getClassrooms(),
        // getAssignments retorna { ok, data: [...] } con include de aula, docente y materia
        getAssignments(),
      ]);
      setTeachers(tRes.data?.result ?? []);
      setSubjects(sRes.data?.data ?? []);
      setClassrooms(cRes.data?.data ?? []);
      setAssignments(aRes.data?.data ?? []);
    } catch {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ci_docente es la PK del modelo Docente (antes id_docente)
  const teacherName = (id) => {
    const t = teachers.find((t) => t.ci_docente === Number(id));
    return t ? `${t.nombre} ${t.apellidos}` : id;
  };

  const subjectName = (id) => subjects.find((s) => s.id_materia === Number(id))?.nombre ?? id;
  const classroomName = (id) => classrooms.find((c) => c.id_aula === Number(id))?.nombre ?? id;

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      id_aula:     String(a.id_aula),
      // id_docente en DocenteMateria referencia ci_docente en Docente
      id_docente:  String(a.id_docente),
      id_materia:  String(a.id_materia),
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        id_aula:    Number(form.id_aula),
        id_docente: Number(form.id_docente),
        id_materia: Number(form.id_materia),
      };
      if (editing) {
        // id es la PK id_docente_materia de la asignación a actualizar
        await updateTeacherSubject({ id: editing.id_docente_materia, ...payload });
        setSuccess('Asignación actualizada');
      } else {
        await assignTeacherSubject(payload);
        setSuccess('Asignación creada');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta asignación?')) return;
    try {
      await deleteAssignment(id);
      setSuccess('Asignación eliminada');
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
    }
  };

  const columns = [
    { key: 'aula',    label: 'Aula',    render: (r) => classroomName(r.id_aula) },
    { key: 'docente', label: 'Docente',  render: (r) => teacherName(r.id_docente) },
    { key: 'materia', label: 'Materia',  render: (r) => subjectName(r.id_materia) },
    {
      key: 'actions', label: 'Acciones',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(r.id_docente_materia)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asignaciones Aula-Docente-Materia</h1>
        <Button onClick={openCreate}>+ Nueva asignación</Button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Table columns={columns} data={assignments} loading={loading} emptyMessage="Sin asignaciones. Crea la primera." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Asignación' : 'Nueva Asignación'}>
        {error && <Alert message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
            <select
              required value={form.id_aula}
              onChange={(e) => setForm({ ...form, id_aula: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Seleccionar aula</option>
              {classrooms.map((c) => (
                <option key={c.id_aula} value={c.id_aula}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
            <select
              required value={form.id_docente}
              onChange={(e) => setForm({ ...form, id_docente: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Seleccionar docente</option>
              {/* ci_docente es la PK del modelo Docente */}
              {teachers.map((t) => (
                <option key={t.ci_docente} value={t.ci_docente}>{t.nombre} {t.apellidos}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select
              required value={form.id_materia}
              onChange={(e) => setForm({ ...form, id_materia: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Seleccionar materia</option>
              {subjects.map((s) => (
                <option key={s.id_materia} value={s.id_materia}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
