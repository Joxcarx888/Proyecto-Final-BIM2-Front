import React from "react";
import { useGetUsers, useAcceptUser } from "../../shared/hooks";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import "./UsersPage.css";

export const UsersPage = () => {
  const { users, isLoading, error, refresh } = useGetUsers(false);
  const { accept, isAccepting, error: acceptError } = useAcceptUser();

  const handleAccept = async (userId) => {
    await accept(userId);
    refresh();
  };

  return (
    <div className="users-page">
        <SidebarDemo />
      <nav className="navbar">
        <h1>Gestión de Usuarios</h1>
      </nav>

      <main>
        <h2>Usuarios Por Aceptar</h2>

        {isLoading && <p>Cargando usuarios...</p>}
        {error && <p className="error">{error}</p>}
        {acceptError && <p className="error">{acceptError}</p>}

        {!isLoading && users.length === 0 && <p>No hay usuarios inactivos.</p>}

        <ul className="user-list">
          {users.map((user) => (
            <li key={user.uid || user.id} className="user-card">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.hotel && user.hotel.name && (
                <p><strong>Hotel:</strong> {user.hotel.name}</p>
              )}
              <button
                onClick={() => handleAccept(user.uid || user.id)}
                className="accept-btn"
                disabled={isAccepting}
              >
                {isAccepting ? "Aceptando..." : "Aceptar Usuario"}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
