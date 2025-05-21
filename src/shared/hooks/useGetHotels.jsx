import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getHotelsByName } from "../../services/api";

export const useGetHotelsByName = (name) => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await getHotelsByName(name); 
      if (response?.hotel) {
        setHotels([response.hotel]);
        setRooms(response.rooms || []);
      } else {
        toast.error("No se encontró el hotel.");
        setHotels([]);
        setRooms([]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Error al cargar el hotel";
      toast.error(msg);
      setHotels([]);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      fetchHotels();
    }
  }, [name]);

  return { hotels, rooms, isLoading, refetch: fetchHotels };
};
