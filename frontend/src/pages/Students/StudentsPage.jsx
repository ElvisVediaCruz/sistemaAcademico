import { useEffect, useState } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/studentsApi';
import { getClassrooms } from '../../api/classroomsApi';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import Alert from '../../components/Alert';
import { usePagination } from '../../hooks/usePagination';

// ci_estudiante es la PK del nuevo modelo Estudiante
const EMPTY_FORM = { ci_estudiante: '', nombre: '', apellidos: '', edad: '', id_aula: '' };

export default function StudentsPage() {
  const [students, setStudents]   = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [search, setSearch]       = useState('');

  const filtered = students.filter((s) =>
    `${s.nombre} ${s.apellidos}`.toLowerCase().includes(search.toLowerCase())
  );

  const { page, totalPages, paginated, goTo, next, prev, reset, total } = usePagination(filtered, 20);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([getStudents(), getClassrooms()]);
      setStudents(sRes.data?.data ?? sRes.data?.result ?? []);
      setClassrooms(cRes.data?.data ?? []);
    } catch {
      setError('Error al cargar datos');
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

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      // ci_estudiante es la PK del nuevo modelo — no se edita
      ci_estudiante: student.ci_estudiante,
      nombre:    student.nombre,
      apellidos: student.apellidos,
      edad:      student.edad,
      id_aula:   student.id_aula ?? '',
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
        // Se envía ci_estudiante como 'id' porque el backend usa req.body.id para findByPk
        await updateStudent({
          id:        editing.ci_estudiante,
          nombre:    form.nombre,
          apellidos: form.apellidos,
          edad:      Number(form.edad),
          id_aula:   Number(form.id_aula),
        });
        setSuccess('Estudiante actualizado');
      } else {
        // ci_estudiante se envía al backend que hace Estudiante.create(data)
        await createStudent({
          ci_estudiante: Number(form.ci_estudiante),
          nombre:        form.nombre,
          apellidos:     form.apellidos,
          edad:          Number(form.edad),
          id_aula:       Number(form.id_aula),
        });
        setSuccess('Estudiante creado');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ci_estudiante) => {
    if (!confirm('¿Eliminar este estudiante?')) return;
    try {
      await deleteStudent(ci_estudiante);
      setSuccess('Estudiante eliminado');
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
    }
  };

  const handleSearch = (e) => { setSearch(e.target.value); reset(); };

  const classroomName = (id) => classrooms.find((c) => c.id_aula === id)?.nombre ?? id ?? '-';

  const columns = [
    // ci_estudiante es la PK del nuevo modelo (antes Sequelize generaba 'id' automáticamente)
    { key: 'ci_estudiante', label: 'CI' },
    { key: 'nombre',     label: 'Nombre' },
    { key: 'apellidos',  label: 'Apellidos' },
    { key: 'edad',       label: 'Edad' },
    { key: 'aula',       label: 'Aula', render: (r) => classroomName(r.id_aula) },
    {
      key: 'actions', label: 'Acciones',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          <Button size="sm" variant="danger"    onClick={() => handleDelete(r.ci_estudiante)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
        <Button onClick={openCreate}>+ Nuevo estudiante</Button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Table columns={columns} data={paginated} loading={loading} emptyMessage="Sin estudiantes registrados" />
        <Pagination page={page} totalPages={totalPages} total={total} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Estudiante' : 'Nuevo Estudiante'}>
        {error && <Alert message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CI</label>
              <input
                type="number" required value={form.ci_estudiante}
                onChange={(e) => setForm({ ...form, ci_estudiante: e.target.value })}
                disabled={!!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
              <input
                type="number" required min="1" value={form.edad}
                onChange={(e) => setForm({ ...form, edad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
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
