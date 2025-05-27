// src/hooks/useForgotPassword.js
import { useState } from "react";
import { forgotPassword } from "../../services/api";
import { toast } from "react-hot-toast";
import { forgotPasswordSchema } from "../../shared/validators";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const requestReset = async (email) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      await forgotPasswordSchema.validate({ email });
      const res = await forgotPassword(email);
      const msg = res.data?.msg || "Correo enviado con éxito";
      setResponse(msg);
      toast.success(msg);
    } catch (err) {
      if (err.name === "ValidationError") {
        toast.error(err.errors[0]);
        setError(err.errors[0]);
      } else {
        const msg = err.response?.data?.msg || "Error al solicitar restablecimiento";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setResponse(null);
    setError(null);
  };

  return {
    requestReset,
    loading,
    response,
    error,
    clearMessages,
  };
};
