import React from "react";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import { HotelList } from "../../components/hotel/ListHotel";
import "./styleDashboard.css";

export const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <SidebarDemo />
      <HotelList />
    </div>
  );
};
