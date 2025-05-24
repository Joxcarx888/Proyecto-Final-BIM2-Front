import { useGetInvoicesByClient } from "../../shared/hooks";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import "./styleReservation.css"; 

export const InvoicesPage = () => {
  const { invoices, loading, refetch } = useGetInvoicesByClient();

  if (loading) return <p>Cargando facturas...</p>;

  return (
    <div className="page-container">
      <SidebarDemo />
      <main className="content">
        <h1>Mis Facturas</h1>

        {invoices.length === 0 ? (
          <p>No tienes facturas generadas.</p>
        ) : (
          <div className="reservations-grid">
            {invoices.map((inv) => (
              <div key={inv._id} className="reservation-card">
                <h2>{inv.hotel?.name || "Hotel desconocido"}</h2>

                {inv.reservation ? (
                  <>
                    <p><strong>Tipo:</strong> Reservación</p>
                    <p><strong>Días de estadía:</strong> {inv.diasEstadia}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Tipo:</strong> Evento</p>
                    <p><strong>Precio del evento:</strong> ${inv.precioEvento}</p>
                  </>
                )}

                <p><strong>Total pagado:</strong> ${inv.total}</p>
                <p><strong>Fecha de cancelación:</strong> {new Date(inv.fechaCancelacion).toLocaleDateString()}</p>

                {inv.estadoCliente && (
                  <p className={`status-${inv.estadoCliente.toLowerCase()}`}>
                    <strong>Estado cliente:</strong> {inv.estadoCliente}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
