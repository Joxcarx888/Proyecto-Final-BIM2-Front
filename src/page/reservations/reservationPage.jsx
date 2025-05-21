import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";
import { SidebarDemo } from "../../components/nanvbars/sidevbar"; 
import "./styleReservation.css";

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const role = user?.role ? user.role.toUpperCase().trim() : "";
        console.log("Rol para consultar reservaciones:", role);

        const data = await getReservations(role);
        setReservations(data.reservaciones || []);
      } catch (err) {
        setError("No se pudieron cargar las reservaciones.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <SidebarDemo />
      <main className="content">
        {reservations.length === 0 ? (
          <p>No tienes reservaciones.</p>
        ) : (
          reservations.map((res) => (
            <div key={res._id} className="reservation-card">
              <h2>{res.hotel?.name || "Hotel desconocido"}</h2>
              <p><strong>Habitaciones:</strong></p>
              <ul>
                {res.roomList.map((room) => (
                  <li key={room._id}>
                    #{room.roomNumber} - {room.type} - ${room.price} - {room.available ? "Disponible" : "No disponible"}
                  </li>
                ))}
              </ul>
                <p className={res.state ? "status-active" : "status-cancelled"}>
                <strong>Estado:</strong> {res.state ? "Activa" : "Cancelada"}
                </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
