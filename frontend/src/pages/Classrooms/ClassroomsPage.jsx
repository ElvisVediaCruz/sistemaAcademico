import { useEffect, useState } from 'react';
// deleteClassroom — nuevo endpoint DELETE /aula/:id_aula
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from '../../api/classroomsApi';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import Alert from '../../components/Alert';
import { usePagination } from '../../hooks/usePagination';

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nombre, setNombre] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { page, totalPages, paginated, goTo, next, prev, total } = usePagination(classrooms, 20);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getClassrooms();
      setClassrooms(res.data?.data ?? []);
    } catch {
      setError('Error al cargar aulas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setNombre(''); setError(''); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setNombre(c.nombre); setError(''); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await updateClassroom({ id: editing.id_aula, nombre });
        setSuccess('Aula actualizada');
      } else {
        await createClassroom({ nombre });
        setSuccess('Aula creada');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id_aula) => {
    if (!confirm('¿Eliminar esta aula?')) return;
    try {
      await deleteClassroom(id_aula);
      setSuccess('Aula eliminada');
      load();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
    }
  };

  const columns = [
    { key: 'id_aula', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'actions', label: 'Acciones',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(r.id_aula)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Aulas</h1>
        <Button onClick={openCreate}>+ Nueva aula</Button>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Table columns={columns} data={paginated} loading={loading} emptyMessage="Sin aulas registradas" />
        <Pagination page={page} totalPages={totalPages} total={total} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Aula' : 'Nueva Aula'}>
        {error && <Alert message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del aula</label>
            <input
              type="text" required value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: 101, Sala A..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
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
