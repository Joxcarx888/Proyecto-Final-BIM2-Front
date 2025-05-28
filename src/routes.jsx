import { DashboardPage } from "./page/dashboard/dashboardPage";
import { Auth } from "./page/auth";
import { HotelDetailPage } from "./page/hotel";
import { UsersPage, ProfilePage } from "./page/users";
import { Navigate } from "react-router-dom";
import { ReservationsPage } from "./page/reservations";
import { InvoicesPage } from "./page/Invoice";
import { EventsPage } from "./page/events";
import { PasswordRecoveryPage } from "./page/recoverPassword";
import { GraphicsPage } from "./page/graphics";
import { PrivateRoute } from "./components/PrivateRouteTEMP";

const routes = [
  { path: '/auth', element: <Auth /> },
  { path: '/resetPassword', element: <PasswordRecoveryPage /> },

  { path: '/dashboard', element: <PrivateRoute><DashboardPage /></PrivateRoute> },
  { path: '/hotel/:name', element: <PrivateRoute><HotelDetailPage /></PrivateRoute> },
  { path: '/users', element: <PrivateRoute><UsersPage /></PrivateRoute> },
  { path: '/user', element: <PrivateRoute><ProfilePage /></PrivateRoute> },
  { path: '/reservations', element: <PrivateRoute><ReservationsPage /></PrivateRoute> },
  { path: '/invoice', element: <PrivateRoute><InvoicesPage /></PrivateRoute> },
  { path: '/events', element: <PrivateRoute><EventsPage /></PrivateRoute> },
  { path: '/graphics', element: <PrivateRoute><GraphicsPage /></PrivateRoute> },

  { path: '/', element: <Navigate to={'/auth'} /> }
];

export default routes;
