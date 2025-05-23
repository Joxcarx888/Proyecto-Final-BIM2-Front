import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { removeRoomsFromReservation } from '../../services/api';

export const useRemoveRoomsFromReservation = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const removeRooms = async (roomList) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role?.toUpperCase();

    if (role !== 'CLIENT') {
      toast.error("Solo los clientes pueden modificar reservaciones.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await removeRoomsFromReservation(roomList);
      setResponse(data);
      toast.success("Habitaciones eliminadas correctamente");
    } catch (err) {
      console.error("Error desde el hook:", err);
      const message = err.response?.data?.message || err.message || 'Error al eliminar habitaciones';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    removeRooms,
    loading,
    error,
    response,
    clearMessages: () => {
      setError(null);
      setResponse(null);
    }
  };
};
