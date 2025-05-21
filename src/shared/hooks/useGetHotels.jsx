import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getHotelsByName } from "../../services/api";

export const useGetHotelsByName = (name) => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await getHotelsByName(name); 
      console.log("🛬 Respuesta del backend:", response);

      if (response?.hotel) {
        setHotels([response.hotel]);
      } else {
        toast.error("No se encontró el hotel.");
        setHotels([]);
      }

    } catch (error) {
      const msg = error.response?.data?.message || "Error al cargar el hotel";
      toast.error(msg);
      console.error(error);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      console.log("🔍 Buscando hotel por nombre:", name);
      fetchHotels();
    }
  }, [name]);

  return { hotels, isLoading, refetch: fetchHotels };
};
