import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../../shared/hooks";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "../../lib/utils";
import "./sidebar.css";

export function SidebarDemo() {
  const { isLogged, logout, role } = useUserDetails();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [posts, setPosts] = useState([]);

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

              {/* Mostrar solo para ADMIN */}
              {role === "ADMIN" && (
                <SidebarLink
                  link={{ label: "Aceptar Usuarios", href: "/users" }}
                  onClick={() => handleNavigate("/users")}
                  className="sidebar-link"
                />
              )}

              {posts.map((post, idx) => (
                <SidebarLink
                  key={idx}
                  link={{ label: post.title, href: "#" }}
                  onClick={() => handleNavigate(`/post/${post._id}`)}
                  className="sidebar-link"
                />
              ))}
            </div>

            <div className="sidebar-footer">
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
