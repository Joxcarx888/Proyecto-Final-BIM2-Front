import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetHotelsByName, useAddReservation } from "../../shared/hooks";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import "./Hotel.css";

export const Hotel = () => {
  const { name } = useParams();
  const { hotels, rooms, isLoading } = useGetHotelsByName(name);
  const { addReservation, loading, error, response, clearMessages } = useAddReservation();

  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomSelect = (roomId) => {
    setSelectedRoom((prev) => (prev === roomId ? null : roomId));
  };

  const handleReservation = (hotelId) => {
    if (!selectedRoom) return alert("Selecciona una habitación.");
    clearMessages();
    const reservationData = {
      roomList: [selectedRoom],
    };
    addReservation(hotelId, reservationData);
  };

  useEffect(() => {
    if (response || error) {
      const timer = setTimeout(() => {
        clearMessages();
        if (response) setSelectedRoom(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [response, error, clearMessages]);

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
                <p><strong>Cantidad de Habitaciones:</strong> {hotel.roomsAvailable ?? "N/A"}</p>
                {hotel.amenities && <p><strong>Comodidades:</strong> {hotel.amenities}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Publicado{" "}
                  {formatDistanceToNow(new Date(hotel.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>

                <button
                  className="reserve-button mt-4"
                  onClick={() => handleReservation(hotel._id)}
                  disabled={loading}
                >
                  {loading ? "Reservando..." : "Hacer una reservación"}
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {response && <p className="text-green-600 mt-2">{response.message}</p>}
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
            {room.available && (
              <label>
                <input
                  type="radio"
                  name="room"
                  checked={selectedRoom === room._id}
                  onChange={() => handleRoomSelect(room._id)}
                /> Seleccionar
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotel;
