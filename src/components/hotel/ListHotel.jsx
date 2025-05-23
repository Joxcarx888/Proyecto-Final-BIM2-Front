import { useEffect, useState } from "react";
import { getHotels } from "../../services/api";
import { Link } from "react-router-dom";
import { useUserDetails, useAddHotel } from "../../shared/hooks";

export const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useUserDetails();
  const [showAddPanel, setShowAddPanel] = useState(false);

  const { addNewHotel, isAdding, error: addError, success, clearMessages } = useAddHotel();

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const form = e.target;
    const hotelData = {
      name: form.name.value,
      address: form.address.value,
      category: form.category.value,
      roomsAvailable: Number(form.roomsAvailable.value),
      amenities: form.amenities.value.trim(), 

      priceEvent: Number(form.priceEvent.value)
    };

    try {
      await addNewHotel(hotelData);
      setShowAddPanel(false);
      setIsLoading(true);
      const data = await getHotels();
      setHotels(data);
      setIsLoading(false);
    } catch {
      
    }
  };

  if (isLoading) return <p>Cargando hoteles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {role === "ADMIN" && (
        <button
          className="add-hotel-btn"
          onClick={() => {
            clearMessages();
            setShowAddPanel(true);
          }}
        >
          Agregar Hotel
        </button>
      )}

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
            <p><strong>Cantidad de Habitaciones:</strong> {hotel.roomsAvailable ?? "N/A"}</p>
          </Link>
        ))}
      </div>

      {showAddPanel && (
        <div className="side-panel">
          <button className="close-btn" onClick={() => setShowAddPanel(false)}>X</button>
          <h2>Agregar Nuevo Hotel</h2>
          <form onSubmit={handleSubmit} className="hotel-form">
            <label>
              Nombre:
              <input name="name" type="text" required maxLength={50} />
            </label>
            <label>
              Dirección:
              <input name="address" type="text" required />
            </label>
            <label>
              Categoría:
              <input name="category" type="text" />
            </label>
            <label>
              Habitaciones disponibles:
              <input name="roomsAvailable" type="number" min={0} defaultValue={0} />
            </label>
            <label>
              Amenidades (texto plano):
              <input name="amenities" type="text" placeholder="Ej: wifi, piscina, desayuno" />
            </label>
            <label>
              Precio evento:
              <input name="priceEvent" type="number" min={0} step="0.01" />
            </label>

            {addError && <p className="error">{addError}</p>}
            {success && <p className="success">{success}</p>}

            <button type="submit" disabled={isAdding}>
              {isAdding ? "Agregando..." : "Agregar Hotel"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
