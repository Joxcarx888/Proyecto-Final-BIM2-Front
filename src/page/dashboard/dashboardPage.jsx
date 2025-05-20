import React from "react";
import { useHotels } from "../../shared/hooks/useHotels";
import "./styleDashboard.css";

export const DashboardPage = () => {
  const { hotels, isLoading, error } = useHotels();

  if (isLoading) return <p>Cargando hoteles...</p>;
  if (error) return <p>Error al cargar hoteles.</p>;

  return (
    <div className="dashboard-container">
      {hotels.map((hotel) => (
        <div key={hotel._id || hotel.id} className="hotel-card">
          <img
            src={
              hotel.images && hotel.images.length > 0
                ? hotel.images[0]
                : "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/16/1b/4b/hotel-exterior.jpg?w=900&h=500&s=1"
            }
            alt={hotel.name}
          />
          <h3>{hotel.name}</h3>
          <p><strong>Dirección:</strong> {hotel.address || "No disponible"}</p>
          <p><strong>Habitaciones disponibles:</strong> {hotel.roomsAvailable ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
};
