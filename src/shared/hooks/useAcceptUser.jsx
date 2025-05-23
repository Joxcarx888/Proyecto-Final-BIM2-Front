import { useState } from "react";
import { acceptUser } from "../../services/api";

export const useAcceptUser = () => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState(null);

  const accept = async (userId) => {
    try {
      setIsAccepting(true);
      await acceptUser(userId);
      setError(null);
    } catch (err) {
      setError("Error al aceptar usuario.");
      console.error(err);
    } finally {
      setIsAccepting(false);
    }
  };

  return {
    accept,
    isAccepting,
    error,
  };
};
