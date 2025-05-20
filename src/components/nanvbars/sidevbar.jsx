import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../../shared/hooks";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "../../lib/utils";
import "./sidebar.css";

export function SidebarDemo() {
  const { isLogged, logout } = useUserDetails();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

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
