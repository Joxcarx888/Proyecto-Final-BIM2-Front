import { useState, useRef } from 'react';
import { addReservation } from '../../services/api';
import { toast } from 'react-hot-toast';

export const useAddReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const lastHotelIdRef = useRef(null);

  const handleAddReservation = async (hotelId, reservationData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role?.toUpperCase();

    if (role !== 'CLIENT') {
      toast.error("Solo los clientes pueden hacer reservaciones.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      if (lastHotelIdRef.current && lastHotelIdRef.current !== hotelId) {
        console.log("Cambiando de hotel, se fuerza nueva reservación");
      }

      lastHotelIdRef.current = hotelId;

      const data = await addReservation(hotelId, reservationData);
      setResponse(data);
      toast.success("Reservación completada correctamente");
    } catch (err) {
      console.error("Error desde el hook:", err);
      const message = err.response?.data?.message || err.message || 'Error al hacer la reserva';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    addReservation: handleAddReservation,
    loading,
    error,
    response,
    clearMessages: () => {
      setError(null);
      setResponse(null);
    }
  };
};
