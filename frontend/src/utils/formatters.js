export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES');
};

export const estadoColor = (estado) => {
  const map = {
    presente: 'bg-green-100 text-green-800',
    ausente: 'bg-red-100 text-red-800',
    tarde: 'bg-yellow-100 text-yellow-800',
  };
  return map[estado?.toLowerCase()] ?? 'bg-gray-100 text-gray-800';
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
