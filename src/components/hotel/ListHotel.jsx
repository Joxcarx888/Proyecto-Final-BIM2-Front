import { useEffect, useState } from "react";
import { getHotels } from "../../services/api";
import { Link } from "react-router-dom";

export const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        setError("Error al obtener los hoteles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (isLoading) return <p>Cargando hoteles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hotels-grid">
      {hotels.map((hotel) => (
        <Link
          to={`/hotel/${encodeURIComponent(hotel.name)}`}
          key={hotel._id || hotel.id}
          className="hotel-card"
        >
          <img
            src={
              hotel.images?.[0] ||
              "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/16/1b/4b/hotel-exterior.jpg?w=900&h=500&s=1"
            }
            alt={hotel.name}
          />
          <h3>{hotel.name}</h3>
          <p><strong>Dirección:</strong> {hotel.address || "No disponible"}</p>
          <p><strong>Cantidad de Habitaciones</strong> {hotel.roomsAvailable ?? "N/A"}</p>
        </Link>
      ))}
    </div>
  );
};
