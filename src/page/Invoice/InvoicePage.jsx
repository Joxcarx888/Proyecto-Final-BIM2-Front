import { useGetInvoices } from "../../shared/hooks";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import { useState, useEffect } from "react";
import "./styleReservation.css";

export const InvoicesPage = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedRole = null;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        parsedRole = user?.role?.toUpperCase() || null;
      } catch (e) {
        console.error("Error al parsear usuario:", e);
      }
    }

    console.log("Rol desde localStorage:", parsedRole);
    const validRoles = ["CLIENT", "HOTEL", "ADMIN"];
    if (parsedRole && validRoles.includes(parsedRole)) {
      setRole(parsedRole);
    } else {
      console.error("Rol inválido en localStorage:", parsedRole);
      setRole(null);
    }
  }, []);

  const { invoices, loading, refetch } = useGetInvoices(role);

  if (!role) return <p>Cargando información del usuario...</p>;
  if (loading) return <p>Cargando facturas...</p>;

  return (
    <div className="page-container">
      <SidebarDemo />
      <main className="content">
        <h1>Facturas</h1>

        {invoices.length === 0 ? (
          <p>No hay facturas disponibles.</p>
        ) : (
          <div className="reservations-grid">
            {invoices.map((inv) => (
              <div key={inv._id} className="reservation-card">
                <h2>{inv.hotel?.name || "Hotel desconocido"}</h2>
                <p><strong>Cliente:</strong> {inv.user?.name || "Usuario desconocido"}</p>

                {inv.reservation ? (
                  <>
                    <p><strong>Tipo:</strong> Reservación</p>
                    <p><strong>Días de estadía:</strong> {inv.diasEstadia ?? "N/A"}</p>
                  </>
                ) : inv.event ? (
                  <>
                    <p><strong>Tipo:</strong> Evento</p>
                    <p><strong>Precio del evento:</strong> ${inv.precioEvento ?? "N/A"}</p>
                  </>
                ) : (
                  <p><strong>Tipo:</strong> Desconocido</p>
                )}

                <p><strong>Total pagado:</strong> ${inv.total ?? 0}</p>
                <p>
                  <strong>Fecha de cancelación:</strong>{" "}
                  {inv.fechaCancelacion
                    ? new Date(inv.fechaCancelacion).toLocaleDateString()
                    : "No aplica"}
                </p>

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
