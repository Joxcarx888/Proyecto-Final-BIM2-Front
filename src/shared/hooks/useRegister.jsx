import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest, registerHotelOwner } from "../../services";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (name, email, password, username, hotel = null) => {
    setIsLoading(true);

    try {
      const userData = { name, email, password, username };
      if (hotel) userData.hotel = hotel;

      const response = hotel
        ? await registerHotelOwner(userData)
        : await registerRequest(userData);

      if (response.error) throw response.e;

      const { userDetails } = response.data;

      localStorage.setItem("user", JSON.stringify(userDetails));
      toast.success("Usuario registrado exitosamente");

      navigate("/");
    } catch (error) {
      console.error("Error en registro:", error);
      toast.error(
        error?.response?.data?.message || "Ocurrió un error al registrar, intenta de nuevo"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
