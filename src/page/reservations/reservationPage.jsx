import { useEffect, useState } from "react";
import { getReservations } from "../../services/api";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import { useCreateInvoiceUnified, useRemoveRoomsFromReservation } from "../../shared/hooks";
import { toast } from "react-hot-toast";
import "./styleReservation.css";

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [diasEstadia, setDiasEstadia] = useState("");
  const [mode, setMode] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});

  const { createInvoice, loading: creatingInvoice } = useCreateInvoiceUnified();
  const { removeRooms, loading: removingRooms } = useRemoveRoomsFromReservation();

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

        await removeRooms(mode.roomList.map((r) => r._id));
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
            await removeRooms(res.roomList.map((r) => r._id));
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

  const toggleRoomSelection = (reservationId, roomId) => {
    setSelectedRooms((prev) => {
      const current = prev[reservationId] || [];
      const updated = current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId];
      return { ...prev, [reservationId]: updated };
    });
  };

  const handleRemoveRooms = async (reservationId) => {
    const roomIds = selectedRooms[reservationId];
    if (!roomIds || roomIds.length === 0) {
      toast.error("Selecciona al menos una habitación para eliminar.");
      return;
    }

    await removeRooms(roomIds);
    setReservations((prev) =>
      prev.map((res) =>
        res._id === reservationId
          ? {
              ...res,
              roomList: res.roomList.filter((room) => !roomIds.includes(room._id))
            }
          : res
      )
    );
    setSelectedRooms((prev) => ({ ...prev, [reservationId]: [] }));
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
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedRooms[res._id]?.includes(room._id) || false}
                          onChange={() => toggleRoomSelection(res._id, room._id)}
                        />
                        #{room.roomNumber} - {room.type} - ${room.price} - {room.available ? "Disponible" : "No disponible"}
                      </label>
                    </li>
                  ))}
                </ul>
                <p className={res.state ? "status-active" : "status-cancelled"}>
                  <strong>Estado:</strong> {res.state ? "Activa" : "Cancelada"}
                </p>
                {res.state && (
                  <>
                    <button
                      className="button"
                      onClick={() => handlePagarUna(res._id, res.hotel._id, res.roomList)}
                    >
                      Pagar
                    </button>
                    <button
                      className="button danger"
                      disabled={removingRooms}
                      onClick={() => handleRemoveRooms(res._id)}
                    >
                      {removingRooms ? "Eliminando..." : "Eliminar habitaciones seleccionadas"}
                    </button>
                  </>
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
