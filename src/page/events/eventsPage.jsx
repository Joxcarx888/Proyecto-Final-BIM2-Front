import { useEffect, useState } from "react";
import { getEvents, updateEventById, deleteEventById, createInvoiceEvent  } from "../../services/api";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import toast, { Toaster } from "react-hot-toast";
import "./styleEvents.css";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ event: "", date: "", time: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

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

  const handlePay = async (eventId) => {
  try {
    await createInvoiceEvent({ eventId }); 

    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev._id === eventId ? { ...ev, estado: false } : ev
      )
    );

    toast.success("Factura creada y evento pagado correctamente");
  } catch (error) {
    toast.error("Error al crear factura del evento");
    console.error(error);
  }
};

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setForm({
      event: event.event,
      date: event.date.split("T")[0],
      time: event.time,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!form.event.trim()) {
        toast.error("El nombre del evento es obligatorio");
        return;
      }
      if (!form.date) {
        toast.error("La fecha es obligatoria");
        return;
      }
      if (!form.time) {
        toast.error("La hora es obligatoria");
        return;
      }

      const updated = await updateEventById(editingEvent._id, form);

      setEvents((prev) =>
        prev.map((ev) => (ev._id === editingEvent._id ? updated.event : ev))
      );

      toast.success("Evento actualizado correctamente");
      setEditingEvent(null);
      setForm({ event: "", date: "", time: "" });
    } catch (err) {
      toast.error("Error al actualizar evento");
      console.error(err);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    try {
      await deleteEventById(eventId);
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      toast.success("Evento eliminado correctamente");
    } catch (err) {
      toast.error("Error al eliminar evento");
    }
  };

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
                <p>
                  <strong>Estado:</strong>{" "}
                  {!event.estado ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>✔ Pagado</span>
                  ) : (
                    <span style={{ color: "red" }}>Pendiente</span>
                  )}
                </p>

                {event.estado && user?.role === "CLIENT" && (
                  <>
                    <button onClick={() => handlePay(event._id)} className="pay-button">Pagar</button>
                    <button onClick={() => handleEditClick(event)} className="edit-button">Editar</button>
                    <button onClick={() => handleDelete(event._id)} className="delete-button">Eliminar</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {editingEvent && (
        <div className="drawer">
          <h2>Editar Evento</h2>
          <label>
            Nombre:
            <input
              name="event"
              maxLength="25"
              value={form.event}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Fecha:
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Hora:
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleFormChange}
            />
          </label>
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleUpdate} className="save-button">Guardar</button>
            <button
              onClick={() => {
                setEditingEvent(null);
                setForm({ event: "", date: "", time: "" });
              }}
              className="cancel-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};
