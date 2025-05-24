import React, { useState, useEffect } from "react";
import { useAddReservation, useAddEvents, useGetHotelsByName, useUserDetails } from "../../shared/hooks";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import "./Hotel.css";

export const Hotel = ({ hotel }) => {
  const { role, hotel: userHotelId } = useUserDetails();
  const { rooms, isLoading } = useGetHotelsByName(hotel.name); 
  const {
    addReservation,
    loading,
    error,
    response,
    clearMessages,
  } = useAddReservation();

  const {
    createEvent,
    loading: creatingEvent,
    error: eventError,
    response: eventResponse,
    clearMessages: clearEventMessages,
  } = useAddEvents();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  const handleRoomSelect = (roomId) => {
    setSelectedRoom((prev) => (prev === roomId ? null : roomId));
  };

  const handleReservation = () => {
    if (!selectedRoom) return alert("Selecciona una habitación.");
    clearMessages();
    const reservationData = {
      roomList: [selectedRoom],
    };
    addReservation(hotel._id, reservationData);
  };

  const handleCreateEvent = () => {
    if (!eventName || !eventDate || !eventTime) {
      alert("Completa todos los campos del evento.");
      return;
    }

    clearEventMessages();

    const eventData = {
      event: eventName,
      cronograma: eventDate,
      time: eventTime,
      hotel: hotel._id,
    };

    createEvent(eventData);
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

  useEffect(() => {
    if (eventResponse || eventError) {
      const timer = setTimeout(() => {
        clearEventMessages();
        if (eventResponse) {
          setEventName('');
          setEventDate('');
          setEventTime('');
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [eventResponse, eventError, clearEventMessages]);

  if (isLoading) return <p>Cargando habitaciones...</p>;

  return (
    <div className="hotel-container">
      <div className="hotel-details">
        <h2 className="text-2xl font-bold mb-4">Detalles del hotel: {hotel.name}</h2>

        {role === "ADMIN" && (
          <button className="edit-button mb-4">
            Editar
          </button>
        )}

        {role === "HOTEL" && userHotelId === hotel._id && (
          <button className="add-room-button mb-4">
            Añadir room
          </button>
        )}


        <div className="hotel-card">
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
            onClick={handleReservation}
            disabled={loading}
          >
            {loading ? "Reservando..." : "Hacer una reservación"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {response && <p className="text-green-600 mt-2">{response.message}</p>}

          <div className="event-form mt-6">
            <h4 className="text-md font-semibold mb-2">Crear Evento</h4>
            <input
              type="text"
              placeholder="Nombre del evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="input mb-2"
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="input mb-2"
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="input mb-2"
            />
            <button
              className="reserve-button"
              onClick={handleCreateEvent}
              disabled={creatingEvent}
            >
              {creatingEvent ? "Creando evento..." : "Crear evento"}
            </button>
            {eventError && <p className="text-red-500 mt-2">{eventError}</p>}
            {eventResponse && <p className="text-green-600 mt-2">{eventResponse.msg}</p>}
          </div>
        </div>
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
