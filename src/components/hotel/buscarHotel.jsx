import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHotelsByName } from "../../shared/hooks/useGetHotels";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const Hotel = () => {
  const { name } = useParams(); // ← obtiene el nombre desde la URL
  const { hotels, isLoading } = useGetHotelsByName(name); // ← busca por nombre
  const navigate = useNavigate();

  const handleViewDetail = (name) => {
    navigate(`/hotel/${encodeURIComponent(name)}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Detalles del hotel</h2>

      {isLoading && <p>Cargando hotel...</p>}

      {!isLoading && hotels.length === 0 && (
        <p>No se encontró un hotel con ese nombre.</p>
      )}

      {!isLoading && hotels.length > 0 && (
        <div className="grid gap-4">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="border p-4 rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold">{hotel.name}</h3>
              <p><strong>Dirección:</strong> {hotel.address}</p>
              <p><strong>Categoría:</strong> {hotel.category}</p>
              <p><strong>Habitaciones disponibles:</strong> {hotel.roomsAvailable ?? "N/A"}</p>
              {hotel.amenities && <p><strong>Comodidades:</strong> {hotel.amenities}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Publicado {formatDistanceToNow(new Date(hotel.createdAt), { addSuffix: true, locale: es })}
              </p>

              <button
                onClick={() => handleViewDetail(hotel.name)}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotel;
