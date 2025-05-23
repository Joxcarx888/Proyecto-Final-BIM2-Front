import { DashboardPage } from "./page/dashboard/dashboardPage";
import { Auth } from "./page/auth";
import { HotelDetailPage } from "./page/hotel";
import { UsersPage } from "./page/users"; 
import { Navigate } from "react-router-dom";
import {ReservationsPage} from "./page/reservations"

const routes = [
  { path: '/auth', element: <Auth /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/hotel/:name', element: <HotelDetailPage /> },
  { path: '/users', element: <UsersPage /> },  
  { path: '/reservations', element: <ReservationsPage /> },
  { path: '/', element: <Navigate to={'/auth'} /> }
];

export default routes;
