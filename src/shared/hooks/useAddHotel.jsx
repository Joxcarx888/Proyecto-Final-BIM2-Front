import { useState } from "react";
import { addHotel } from "../../services/api";

export const useAddHotel = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addNewHotel = async (hotelData) => {
    setIsAdding(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addHotel(hotelData);
      setSuccess("Hotel agregado correctamente");
      return response;
    } catch (err) {
      setError("Error al agregar hotel");
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addNewHotel,
    isAdding,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
};
