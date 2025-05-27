import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from '../shared/validators'; 
import { useLogin } from '../shared/hooks';
import toast from "react-hot-toast";

import iconEmail from '../assets/icons/3.png';
import iconPassword from '../assets/icons/5.png';

export const Login = ({ switchAuthHandler }) => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesión. Intenta más tarde.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Iniciar Sesión</h2>

      <div className="container-input">
        <img src={iconEmail} alt="email icon" className="input-icon" />
        <input type="text" placeholder="Email" {...register("email")} />
      </div>
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <div className="container-input">
        <img src={iconPassword} alt="password icon" className="input-icon" />
        <input type="password" placeholder="Password" {...register("password")} />
      </div>
      {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

      <a href="resetPassword">¿Olvidaste tu contraseña?</a>
      <button type="submit" className="button" disabled={isLoading}>
        INICIAR SESIÓN
      </button>
    </form>
  );
};
