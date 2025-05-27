import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/img/profile.png";
import { useUserDetails } from "../../shared/hooks";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "../../lib/utils";
import "./sidebar.css";

export function SidebarDemo() {
  const { isLogged, logout, role, username } = useUserDetails();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div>
      <div className={cn("sidebar-container", open ? "expanded" : "collapsed")}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="sidebar-body justify-between gap-10">
            <div className="sidebar-links">
              <SidebarLink
                link={{ label: "Dashboard", href: "/dashboard" }}
                onClick={() => handleNavigate("/dashboard")}
                className="sidebar-link"
              />

              <SidebarLink
                link={{ label: "Reservaciones", href: "/reservations" }}
                onClick={() => handleNavigate("/reservations")}
                className="sidebar-link"
              />

              <SidebarLink
                link={{ label: "Facturas", href: "/invoice" }}
                onClick={() => handleNavigate("/invoice")}
                className="sidebar-link"
              />

              {role === "ADMIN" && (
                <>
                  <SidebarLink
                    link={{ label: "Aceptar Usuarios", href: "/users" }}
                    onClick={() => handleNavigate("/users")}
                    className="sidebar-link"
                  />
                  <SidebarLink
                    link={{ label: "Eventos", href: "/events" }}
                    onClick={() => handleNavigate("/events")}
                    className="sidebar-link"
                  />
                </>
              )}

              {role === "HOTEL" && (
                <>
                  <SidebarLink
                    link={{ label: "Mis habitaciones", href: "#" }}
                    onClick={() => {}}
                    className="sidebar-link"
                  />
                  <SidebarLink
                    link={{ label: "Eventos", href: "/events" }}
                    onClick={() => handleNavigate("/events")}
                    className="sidebar-link"
                  />
                </>
              )}

              {role === "CLIENT" && (
                <SidebarLink
                  link={{ label: "Eventos", href: "/events" }}
                  onClick={() => handleNavigate("/events")}
                  className="sidebar-link"
                />
              )}
            </div>

            <div className="sidebar-footer">
              <SidebarLink
                link={{
                  label: isLogged ? username : "User",
                  href: "/user",
                  icon: (
                    <img
                      src={profile}
                      className="sidebar-avatar"
                      alt="Avatar"
                    />
                  ),
                }}
                className="sidebar-link"
              />
              <SidebarLink
                link={{
                  label: isLogged ? "Logout" : "Login",
                  href: isLogged ? "#" : "/auth",
                }}
                onClick={isLogged ? handleLogout : () => handleNavigate("/auth")}
                className="sidebar-link"
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
    </div>
  );
}
