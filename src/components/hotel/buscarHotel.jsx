import React from "react";
import { useParams } from "react-router-dom";
import { useGetHotelsByName } from "../../shared/hooks/useGetHotels";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import "./Hotel.css";

export const Hotel = () => {
  const { name } = useParams(); 
  const { hotels, rooms, isLoading } = useGetHotelsByName(name); 

  return (
    <div className="hotel-container">
      <div className="hotel-details">
        <h2 className="text-2xl font-bold mb-4">Detalles del hotel: {name}</h2>

        {isLoading && <p>Cargando hotel...</p>}

        {!isLoading && hotels.length === 0 && (
          <p>No se encontró un hotel con ese nombre.</p>
        )}

        {!isLoading && hotels.length > 0 && (
          <div className="grid gap-4">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="hotel-card">
                <img
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/16/1b/4b/hotel-exterior.jpg?w=900&h=500&s=1"
                  alt="Imagen del hotel"
                  className="hotel-image"
                />
                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                <p><strong>Dirección:</strong> {hotel.address}</p>
                <p><strong>Categoría:</strong> {hotel.category}</p>
                <p><strong>Habitaciones disponibles:</strong> {hotel.roomsAvailable ?? "N/A"}</p>
                {hotel.amenities && <p><strong>Comodidades:</strong> {hotel.amenities}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Publicado {formatDistanceToNow(new Date(hotel.createdAt), { addSuffix: true, locale: es })}
                </p>

                <button className="reserve-button mt-4">
                  Hacer una reservación
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hotel-rooms">
        <h3 className="text-xl font-bold mb-4">Habitaciones</h3>
        {rooms.length === 0 && <p>No hay habitaciones registradas.</p>}
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`room-card ${room.available ? "available" : "unavailable"}`}
          >
            <p><strong>Número:</strong> {room.roomNumber}</p>
            <p><strong>Tipo:</strong> {room.type}</p>
            <p><strong>Precio:</strong> Q{room.price}</p>
            <p><strong>Disponible:</strong> {room.available ? "Sí" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotel;
