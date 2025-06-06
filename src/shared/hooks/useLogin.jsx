import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login as loginRequest } from "../../services"; 

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);

    try {
      const response = await loginRequest({ email, password });

      const { userDetails } = response.data;
      console.log("userDetails recibido:", userDetails);
      const token = userDetails?.token || response.data.token; 

      if (userDetails && token) {
        const userData = { 
          ...userDetails, 
          role: userDetails.role?.toUpperCase() || "",
          token 
        };

        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Sesión iniciada correctamente");
        navigate("/dashboard");
      } else {
        throw new Error("Error al obtener datos del usuario.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || "Ocurrió un error al iniciar sesión, intenta de nuevo"
      );
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
