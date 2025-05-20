import { DashboardPage } from "./page/dashboard/dashboardPage";
import {Auth} from "./page/auth"

const routes = [
    { path: '/', element: <Auth /> },                
    { path: '/dashboard', element: <DashboardPage /> }  
  ];
  

export default routes;