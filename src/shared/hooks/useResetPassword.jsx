import { useState } from "react";
import { resetPassword } from "../../services/api";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const submitNewPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword); 
      setResponse(res.data?.msg || "Contraseña actualizada");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al restablecer contraseña");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    submitNewPassword,
    loading,
    response,
    error,
    clearMessages,
  };
};
