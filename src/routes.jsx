import { DashboardPage } from "./page/dashboard/dashboardPage";
import {Auth} from "./page/auth"

const routes = [
    { path: '/auth', element: <Auth /> },                
    { path: '/dashboard', element: <DashboardPage /> }  
  ];
  

export default routes;