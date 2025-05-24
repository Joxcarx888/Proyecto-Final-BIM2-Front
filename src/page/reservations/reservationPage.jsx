import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import { useCreateInvoiceUnified } from "../../shared/hooks";
// import { useRemoveRoomsFromReservation } from "../../shared/hooks/useRemoveRoomsFromReservation";
import { toast } from "react-hot-toast";
import "./styleReservation.css";

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [diasEstadia, setDiasEstadia] = useState("");
  const [mode, setMode] = useState(null);

  const { createInvoice, loading: creatingInvoice } = useCreateInvoiceUnified();
  // const { removeRoomsFromReservation } = useRemoveRoomsFromReservation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const role = user?.role ? user.role.toUpperCase().trim() : "";

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

  const handlePagarUna = (reservationId, hotelId, roomList) => {
    setMode({
      type: 'one',
      reservationId,
      hotelId,
      roomList
    });
    setShowForm(true);
  };

  const handlePagarTodas = () => {
    setMode({ type: 'all' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diasEstadia || diasEstadia < 1) return;

    const activeReservations = reservations.filter((res) => res.state === true);

    try {
      if (mode?.type === 'one') {
        await createInvoice({
          type: 'reservation',
          data: { hotelId: mode.hotelId, diasEstadia }
        });

        // await removeRoomsFromReservation(mode.roomList.map((r) => r._id));
        setReservations((prev) => prev.filter((r) => r._id !== mode.reservationId));
        toast.success("Factura generada correctamente");
      } else if (mode?.type === 'all') {
        let successCount = 0;
        for (const res of activeReservations) {
          try {
            await createInvoice({
              type: 'reservation',
              data: { hotelId: res.hotel._id, diasEstadia }
            });

            // await removeRoomsFromReservation(res.roomList.map((r) => r._id));
            successCount++;
          } catch (err) {
            console.error(`Error en reserva ${res._id}:`, err);
          }
        }

        setReservations((prev) => prev.filter((r) => !r.state));
        if (successCount > 0) {
          toast.success(`${successCount} factura(s) generadas correctamente`);
        } else {
          toast.error("No se pudo generar ninguna factura.");
        }
      }
    } catch (err) {
      console.error("Error al procesar pagos:", err);
    } finally {
      setShowForm(false);
      setDiasEstadia("");
      setMode(null);
    }
  };

  const activeReservationsExist = reservations.some((res) => res.state);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <SidebarDemo />
      <main className="content">
        {activeReservationsExist && (
          <button className="button pay-all" onClick={handlePagarTodas}>
            Pagar todas las reservaciones activas
          </button>
        )}

        {reservations.length === 0 ? (
          <p>No tienes reservaciones.</p>
        ) : (
          <div className="reservations-grid">
            {reservations.map((res) => (
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
                {res.state && (
                  <button
                    className="button"
                    onClick={() =>
                      handlePagarUna(res._id, res.hotel._id, res.roomList)
                    }
                  >
                    Pagar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="invoice-form-overlay">
            <form className="invoice-form" onSubmit={handleSubmit}>
              <h3>{mode?.type === 'all' ? "Pagar todas las reservaciones" : "Generar Factura"}</h3>
              <label>Días de estadía:</label>
              <input
                type="number"
                value={diasEstadia}
                onChange={(e) => setDiasEstadia(e.target.value)}
                min={1}
                required
              />
              <div className="form-buttons">
                <button type="submit" className="button" disabled={creatingInvoice}>
                  {creatingInvoice ? "Procesando..." : "Confirmar Pago"}
                </button>
                <button
                  type="button"
                  className="button cancel"
                  onClick={() => {
                    setShowForm(false);
                    setMode(null);
                    setDiasEstadia("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
