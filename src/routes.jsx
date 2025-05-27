import { DashboardPage } from "./page/dashboard/dashboardPage";
import { Auth } from "./page/auth";
import { HotelDetailPage } from "./page/hotel";
import { UsersPage } from "./page/users"; 
import { Navigate } from "react-router-dom";
import {ReservationsPage} from "./page/reservations"
import {InvoicesPage} from "./page/Invoice"
import {EventsPage} from "./page/events"
import {PasswordRecoveryPage} from "./page/recoverPassword"

const routes = [
  { path: '/auth', element: <Auth /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/hotel/:name', element: <HotelDetailPage /> },
  { path: '/users', element: <UsersPage /> },  
  { path: '/reservations', element: <ReservationsPage /> },
  { path: '/invoice', element: <InvoicesPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/resetPassword', element: <PasswordRecoveryPage /> },
  { path: '/', element: <Navigate to={'/auth'} /> }
];

export default routes;
