import { useState } from "react";
import { updateHotelById } from "../../services/api";

export const useUpdateHotel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const updateHotel = async (hotelId, data) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await updateHotelById(hotelId, data);
      setResponse(res.message); 
      return res.hotel;
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el hotel.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    updateHotel,
    loading,
    error,
    response,
    clearMessages,
  };
};
