import { useParams } from "react-router-dom";
import { useGetHotelsByName } from "../../shared/hooks/useGetHotels";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import { Hotel } from "../../components/hotel/buscarHotel";
import "./styleHotel.css";

export const HotelDetailPage = () => {
  const { name } = useParams();
  const { hotels, isLoading } = useGetHotelsByName(decodeURIComponent(name));
  const hotel = hotels?.[0];

  return (
    <div className="hotel-detail-layout">
      <SidebarDemo />

      <main className="hotel-detail-content">
        <h1 className="hotel-detail-title text-3xl font-bold mb-6 text-blue-700">Detalle del Hotel</h1>

        {isLoading ? (
          <p className="text-gray-600">Cargando detalles...</p>
        ) : !hotel ? (
          <p className="text-red-500">No se encontró información para el hotel: <strong>{name}</strong></p>
        ) : (
          <Hotel hotel={hotel} />
        )}
      </main>
    </div>
  );
};
