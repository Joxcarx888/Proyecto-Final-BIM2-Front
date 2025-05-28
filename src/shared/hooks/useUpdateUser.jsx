import { useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import { updateUserById } from "../../services/api";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const updateUser = async (formData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Debes iniciar sesión para actualizar tu perfil.");

      const user = JSON.parse(userStr);
      const token = user.token;
      if (!token) throw new Error("Token no encontrado.");

      const decoded = jwtDecode(token); 
      const userId = decoded.uid;
      if (!userId) throw new Error("No se pudo obtener el ID del usuario desde el token.");

      const res = await updateUserById(userId, formData);

      localStorage.setItem("user", JSON.stringify({
        ...user,
        username: res.user.username,
        email: res.user.email,
      }));

      setResponse("Usuario actualizado correctamente.");
      return res.user;
    }catch (err) {
      console.log("Error completo:", err);
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);

      const backendMsg = err.response?.data?.msg;
      let msg = err.message || "Error al actualizar el usuario.";

      if (backendMsg === "Debe ingresar su contraseña actual para cambiarla") {
        msg = "Para cambiar la contraseña, debes ingresar tu contraseña actual.";
      } else if (backendMsg) {
        msg = backendMsg;
      }

      setError(msg);
      throw new Error(msg);
    }
    finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    updateUser,
    loading,
    error,
    response,
    clearMessages,
  };
};
