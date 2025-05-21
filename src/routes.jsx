import { DashboardPage } from "./page/dashboard/dashboardPage";
import {Auth} from "./page/auth"
import {HotelDetailPage} from "./page/hotel"
import { Navigate } from "react-router-dom";

const routes = [
    { path: '/auth', element: <Auth /> },                
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/hotel/:name', element: <HotelDetailPage/> },
    { path: '/', element:<Navigate to={'/auth'}/>}  
  ];

export default routes;