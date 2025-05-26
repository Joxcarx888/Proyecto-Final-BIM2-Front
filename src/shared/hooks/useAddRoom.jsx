import { useState } from "react";
import { addRoom as addRoomService } from "../../services";

export const useAddRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const addRoom = async (roomData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await addRoomService(roomData);
      setResponse(result);
    } catch (err) {
      const msg = err?.response?.data?.message || "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    addRoom,
    loading,
    error,
    response,
    clearMessages,
  };
};

export default useAddRoom;