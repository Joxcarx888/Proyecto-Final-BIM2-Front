import { DashboardPage } from "./page/dashboard/dashboardPage";
import {Auth} from "./page/auth"

const routes = [
    { path: '/', element: <Auth /> },
    {path: '/', element:<DashboardPage/>}
];

export default routes;