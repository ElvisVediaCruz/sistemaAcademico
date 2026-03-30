import { useEffect, useState } from 'react';
// deleteTeacher — nuevo endpoint DELETE /docente/:ci (ci_docente es la PK del modelo Docente)
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../api/teachersApi';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import Alert from '../../components/Alert';
import { usePagination } from '../../hooks/usePagination';

// ci_docente es la PK del modelo Docente (antes id_docente autoincremental)
const EMPTY_FORM = { ci_docente: '', nombre: '', apellidos: '', edad: '', password: '' };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const filtered = teachers.filter((t) =>
    `${t.nombre} ${t.apellidos}`.toLowerCase().includes(search.toLowerCase())
  );

  const { page, totalPages, paginated, goTo, next, prev, reset, total } = usePagination(filtered, 20);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTeachers();
      setTeachers(res.data?.data ?? []);
    } catch {
      setError('Error al cargar docentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (teacher) => {
    setEditing(teacher);
    setForm({
      // ci_docente es la PK — se deshabilita en edición
      ci_docente: teacher.ci_docente ?? '',
      nombre: teacher.nombre,
      apellidos: teacher.apellidos,
      edad: teacher.edad,
      password: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        // Backend updateDocente usa req.body.ci para findByPk(ci_docente)
        await updateTeacher({ ci: form.ci_docente, nombre: form.nombre, apellidos: form.apellidos, edad: Number(form.edad) });
        setSuccess('Docente actualizado');
      } else {
        // Backend createDocente crea usuario + docente con ci_docente = form.ci_docente
        await createTeacher({ ...form, ci_docente: Number(form.ci_docente), edad: Number(form.edad) });
        setSuccess('Docente creado');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ci_docente) => {
    if (!confirm('¿Eliminar este docente?')) return;
    try {
      await deleteTeacher(ci_docente);
      setSuccess('Docente eliminado');
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
    }
  };

  const columns = [
    // ci_docente es la PK (antes id_docente)
    { key: 'ci_docente', label: 'CI' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'edad', label: 'Edad' },
    {
      key: 'actions', label: 'Acciones',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(r.ci_docente)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Docentes</h1>
        <Button onClick={openCreate}>+ Nuevo docente</Button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar docente..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); reset(); }}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Table columns={columns} data={paginated} loading={loading} emptyMessage="Sin docentes registrados" />
        <Pagination page={page} totalPages={totalPages} total={total} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Docente' : 'Nuevo Docente'}>
        {error && <Alert message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CI</label>
              <input
                type="number" required value={form.ci_docente}
                onChange={(e) => setForm({ ...form, ci_docente: e.target.value })}
                disabled={!!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
              <input
                type="number" required min="18" value={form.edad}
                onChange={(e) => setForm({ ...form, edad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text" required value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <input
                type="text" required value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
