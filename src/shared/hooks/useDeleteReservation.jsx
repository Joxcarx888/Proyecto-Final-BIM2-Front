import { useState } from "react";
import { deleteReservationById } from "../../services"; 
import { toast } from "react-hot-toast";

export const useDeleteReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteReservation = async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteReservationById(reservationId); 
      toast.success(result.message || "Reservación cancelada con éxito");
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cancelar reservación";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteReservation,
    loading,
    error,
  };
};