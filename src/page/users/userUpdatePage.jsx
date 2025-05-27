import { useState, useEffect } from "react";
import { useUpdateUser } from "../../shared/hooks/useUpdateUser";
import { SidebarDemo } from "../../components/nanvbars/sidevbar";
import "./styleUpdateUser.css";

export const ProfilePage = () => {
  const { updateUser, loading, error, response, clearMessages } = useUpdateUser();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    newPassword: ""
  });

  useEffect(() => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const parsed = JSON.parse(userStr);
    console.log("Usuario cargado:", parsed); // <- revisa si tiene _id aquí
    setUser(parsed);
    setForm((prev) => ({ ...prev, name: parsed.username }));
  }
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando form:", form);
    try {
      await updateUser(form);
    } catch (err) {
      console.error("Error desde handleSubmit:", err);
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div>
      <SidebarDemo />
      <div className="profile-container" style={{ maxWidth: 500, margin: "2rem auto", padding: "1rem" }}>
        <h2>Perfil de usuario</h2>

        <div style={{ marginBottom: "1rem" }}>
          <p><strong>Nombre de usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nombre de usuario</label>
          <input
            name="username"
            placeholder="Nombre"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Contraseña actual</label>
          <input
            name="password"
            type="password"
            placeholder="Contraseña actual"
            value={form.password}
            onChange={handleChange}
          />

          <label>Nueva contraseña</label>
          <input
            name="newPassword"
            type="password"
            placeholder="Nueva contraseña"
            value={form.newPassword}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar perfil"}
          </button>

          {response && <p style={{ color: "green", marginTop: "0.5rem" }}>{response}</p>}
          {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};
