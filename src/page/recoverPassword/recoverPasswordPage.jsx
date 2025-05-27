import { useState, useEffect } from "react";
import { useForgotPassword, useResetPassword } from "../../shared/hooks";
import { useNavigate } from "react-router-dom";
import "./styleRecoverPassword.css";

export const PasswordRecoveryPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    requestReset,
    loading: loadingReset,
    response: responseReset,
    error: errorReset,
    clearMessages: clearResetMessages,
  } = useForgotPassword();

  const {
    submitNewPassword,
    loading: loadingChange,
    response: responseChange,
    error: errorChange,
    clearMessages: clearChangeMessages,
  } = useResetPassword();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearResetMessages();
    const res = await requestReset(email);
    if (!res?.error) {
      setStep(2);
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    clearChangeMessages();
    if (token.trim().length === 64) {
      setStep(3);
    } else {
      alert("Token inválido");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    clearChangeMessages();
    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    await submitNewPassword(token, password);
  };

  useEffect(() => {
    if (responseChange) {
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  }, [responseChange, navigate]);

  return (
    <div className="password-recovery-container">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h2>¿Olvidaste tu contraseña?</h2>
          <input
            type="email"
            placeholder="Tu correo registrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={clearResetMessages}
            required
          />
          <button type="submit" disabled={loadingReset}>
            {loadingReset ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
          {responseReset && <p className="success">{responseReset}</p>}
          {errorReset && <p className="error">{errorReset}</p>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTokenSubmit}>
          <h2>Ingresa el token de recuperación</h2>
          <input
            type="text"
            placeholder="Token de recuperación"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button type="submit">Validar token</button>
          <button type="button" onClick={() => setStep(1)}>
            Volver
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit}>
          <h2>Restablecer contraseña</h2>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={clearChangeMessages}
            required
          />
          <button type="submit" disabled={loadingChange}>
            {loadingChange ? "Cambiando..." : "Cambiar"}
          </button>
          {responseChange && <p className="success">{responseChange}</p>}
          {errorChange && <p className="error">{errorChange}</p>}
          <button type="button" onClick={() => setStep(1)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};
