import { useEffect, useState } from "react";
import { getEvents } from "../../services/api";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import "./styleEvents.css";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando eventos:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando eventos...</p>;

  return (
    <div className="page-container">
      <SidebarDemo />
      <main className="content">
        <h1 style={{ textAlign: "center" }}>Eventos</h1>
        {events.length === 0 ? (
          <p style={{ textAlign: "center" }}>No hay eventos para mostrar.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.event}</h3>
                <p><strong>Hotel:</strong> {event.hotel?.name || "No definido"}</p>
                <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {event.time}</p>
                <p><strong>Precio:</strong> ${event.precio}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
