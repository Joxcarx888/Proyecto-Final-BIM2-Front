import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createEvent } from '../../services'; 

export const useAddEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleCreateEvent = async (eventData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role?.toUpperCase();

    if (role !== 'CLIENT') {
      toast.error("Solo los clientes pueden crear eventos.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await createEvent(eventData);
      setResponse(data);
      toast.success("Evento creado correctamente");
    } catch (err) {
      console.error("Error desde el hook:", err);
      const message = err.response?.data?.msg || err.message || 'Error al crear evento';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent: handleCreateEvent,
    loading,
    error,
    response,
    clearMessages: () => {
      setError(null);
      setResponse(null);
    }
  };
};
