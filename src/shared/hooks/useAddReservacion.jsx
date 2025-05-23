import { useState, useRef } from 'react';
import { addReservation } from '../../services/api';

export const useAddReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const lastHotelIdRef = useRef(null);

  const handleAddReservation = async (hotelId, reservationData) => {
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
    } catch (err) {
      console.error("Error desde el hook:", err);
      setError(err.response?.data?.message || err.message || 'Error al hacer la reserva');
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
