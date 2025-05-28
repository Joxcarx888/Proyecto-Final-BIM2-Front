import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../../shared/hooks";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { getInvoices } from "../../services/api";
import "./graphicsStyle.css";

export const GraphicsPage = () => {
  const { role } = useUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/dashboard");
    }
  }, [role]);

  const [reservationData, setReservationData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoices("ADMIN");

        const grouped = {};

        for (const invoice of data.invoices) {
          const hotelName = invoice.hotel?.name || "Desconocido";

          if (!grouped[hotelName]) {
            grouped[hotelName] = { reservas: 0, total: 0 };
          }

          grouped[hotelName].reservas += 1;
          grouped[hotelName].total += invoice.total || 0;
        }

        const reservasList = [];
        const totalList = [];

        for (const [hotel, values] of Object.entries(grouped)) {
          reservasList.push({ name: hotel, reservas: values.reservas });
          totalList.push({ name: hotel, total: values.total });
        }

        setReservationData(reservasList);
        setTotalData(totalList);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="graphics-page">
      <SidebarDemo />
      <div className="graphics-content">
        <h1>Estadísticas de Facturación</h1>

        <div className="chart-section">
          <h3>Hoteles con más Reservaciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationData}>
              <CartesianGrid stroke="#D9C2A6" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#2E2E2E" />
              <YAxis stroke="#2E2E2E" />
              <Tooltip contentStyle={{ backgroundColor: "#F7F5F0", color: "#2E2E2E" }} />
              <Legend />
              <Bar dataKey="reservas" fill="#E85D0C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>Hoteles con más Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalData}>
              <CartesianGrid stroke="#D9C2A6" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#2E2E2E" />
              <YAxis stroke="#2E2E2E" />
              <Tooltip contentStyle={{ backgroundColor: "#F7F5F0", color: "#2E2E2E" }} />
              <Legend />
              <Bar dataKey="total" fill="#008080" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
