import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddReservation,
  useAddEvents,
  useGetHotelsByName,
  useUserDetails,
  useUpdateHotel,
  useAddRoom,
} from "../../shared/hooks";
import { getMyHotelRooms } from "../../services/";
import { deleteHotelById } from "../../services";
import { getEventsByHotel } from "../../services"; 
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import "./Hotel.css";

export const Hotel = ({ hotel }) => {
  const { role, hotel: userHotelId } = useUserDetails();
  const { rooms, isLoading } = useGetHotelsByName(hotel.name);
  const navigate = useNavigate();

  const { addReservation, loading, error, response, clearMessages } = useAddReservation();
  const { createEvent, loading: creatingEvent, error: eventError, response: eventResponse, clearMessages: clearEventMessages } = useAddEvents();
  const { updateHotel, loading: updatingHotel, error: updateError, response: updateResponse, clearMessages: clearUpdateMessages } = useUpdateHotel();
  const { addRoom, loading: addingRoom, error: roomError, response: roomResponse, clearMessages: clearRoomMessages } = useAddRoom();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showAddRoomPanel, setShowAddRoomPanel] = useState(false);
  const [initialRoomsLoaded, setInitialRoomsLoaded] = useState(false); 
  const [editForm, setEditForm] = useState({
    name: hotel.name,
    address: hotel.address,
    category: hotel.category,
    roomsAvailable: hotel.roomsAvailable,
    amenities: hotel.amenities,
    priceEvent: hotel.priceEvent,
  });

  const [newRoomData, setNewRoomData] = useState({
    roomNumber: "",
    type: "",
    price: "",
  });

const [deleting, setDeleting] = useState(false);

const handleDeleteHotel = async () => {
  if (!window.confirm("¿Estás seguro de que deseas eliminar este hotel? Esta acción no se puede deshacer.")) return;
  setDeleting(true);
  try {
    await deleteHotelById(hotel._id);
    toast.success("Hotel eliminado correctamente");
    navigate("/dashboard"); 
  } catch (err) {
    toast.error("Error al eliminar el hotel");
  } finally {
    setDeleting(false);
  }
};

const [events, setEvents] = useState([]);

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEventsByHotel(hotel._id);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  fetchEvents();
}, [hotel._id]);



  useEffect(() => {
    const fetchInitialRooms = async () => {
      try {
        await getMyHotelRooms();

        const reloaded = sessionStorage.getItem("hotelPageReloaded");
        if (!reloaded) {
          sessionStorage.setItem("hotelPageReloaded", "true");
          window.location.reload();
        }

      } catch (err) {
        console.error("Error en la llamada a getMyHotelRooms:", err);
      } finally {
        setInitialRoomsLoaded(true);
      }
    };

    fetchInitialRooms();
  }, []);


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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "roomsAvailable" || name === "priceEvent" ? Number(value) : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    clearUpdateMessages();
    try {
      await updateHotel(hotel._id, editForm);
      toast.success("Hotel actualizado correctamente");
      setShowEditPanel(false);
      const newName = encodeURIComponent(editForm.name.trim());
      navigate(`/hotel/${newName}`);
      window.location.reload();
    } catch (err) {
      toast.error("Error al actualizar hotel");
    }
  };

  const handleAddRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoomData((prev) => ({
      ...prev,
      [name]: name === "roomNumber" || name === "price" ? Number(value) : value,
    }));
  };

  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    clearRoomMessages();
    try {
      await addRoom(newRoomData);
      toast.success("Habitación añadida correctamente");
      setNewRoomData({ roomNumber: "", type: "", price: "" });
      setShowAddRoomPanel(false);
      window.location.reload();
    } catch {
      toast.error("Error al agregar la habitación");
    }
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

  useEffect(() => {
    if (roomError) {
      toast.error(roomError);
    }
  }, [roomError]);

  if (!initialRoomsLoaded) return <p>Preparando vista del hotel...</p>;
  if (isLoading) return <p>Cargando habitaciones...</p>;

  return (
    <div className="hotel-container">
      <div className="hotel-details">
        <h2 className="text-2xl font-bold mb-4">Detalles del hotel: {hotel.name}</h2>

        {role === "HOTEL" && userHotelId === hotel._id && (
          <>
            <button className="edit-button mb-4" onClick={() => setShowEditPanel(true)}>
              Editar
            </button>
            <button className="add-room-button mb-4" onClick={() => setShowAddRoomPanel(true)}>
              Añadir room
            </button>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <button className="edit-button mb-4" onClick={() => setShowEditPanel(true)}>
              Editar
            </button>
            <button className="delete-button mb-4" onClick={handleDeleteHotel} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </>
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

      <div className="hotel-events">
        <h3 className="text-xl font-bold mb-4">Eventos</h3>
        {events.length === 0 ? (
          <p>No hay eventos registrados.</p>
        ) : (
          events.map((event) => {
            const dateObj = new Date(event.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            return (
              <div key={event._id} className="event-card">
                <p><strong>Nombre:</strong> {event.event}</p>
                <p><strong>Fecha:</strong> {formattedDate}</p>
                <p><strong>Hora:</strong> {event.time}</p>
              </div>
            );
          })
        )}
      </div>


      {showEditPanel && (
        <div className="side-panel">
          <button className="close-btn" onClick={() => setShowEditPanel(false)}>X</button>
          <h2>Editar Hotel</h2>
          <form onSubmit={handleUpdateSubmit} className="hotel-form">
            <label>Nombre:
              <input name="name" type="text" required maxLength={50}
                value={editForm.name} onChange={handleEditChange} />
            </label>
            <label>Dirección:
              <input name="address" type="text" required
                value={editForm.address} onChange={handleEditChange} />
            </label>
            <label>Categoría:
              <input name="category" type="text"
                value={editForm.category} onChange={handleEditChange} />
            </label>
            <label>Habitaciones disponibles:
              <input name="roomsAvailable" type="number" min={0}
                value={editForm.roomsAvailable} onChange={handleEditChange} />
            </label>
            <label>Amenidades:
              <input name="amenities" type="text"
                value={editForm.amenities} onChange={handleEditChange} />
            </label>
            <label>Precio evento:
              <input name="priceEvent" type="number" min={0} step="0.01"
                value={editForm.priceEvent} onChange={handleEditChange} />
            </label>

            <button type="submit" disabled={updatingHotel} className="update-button">
              {updatingHotel ? "Actualizando..." : "Actualizar Hotel"}
            </button>
          </form>
        </div>
      )}

      {showAddRoomPanel && (
        <div className="side-panel">
          <button className="close-btn" onClick={() => setShowAddRoomPanel(false)}>X</button>
          <h2>Añadir Habitación</h2>
          <form onSubmit={handleAddRoomSubmit} className="hotel-form">
            <label>Número de habitación:
              <input name="roomNumber" type="number" required
                value={newRoomData.roomNumber} onChange={handleAddRoomChange} />
            </label>
            <label>Tipo:
              <input name="type" type="text" required
                value={newRoomData.type} onChange={handleAddRoomChange} />
            </label>
            <label>Precio:
              <input name="price" type="number" step="0.01" min={0} required
                value={newRoomData.price} onChange={handleAddRoomChange} />
            </label>

            <button type="submit" disabled={addingRoom} className="update-button">
              {addingRoom ? "Agregando..." : "Agregar habitación"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};



export default Hotel;
