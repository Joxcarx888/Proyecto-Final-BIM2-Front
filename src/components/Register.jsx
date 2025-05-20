import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRegister } from "../shared/hooks";

const registerSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  username: yup.string().required("El username es obligatorio"),
  email: yup.string().email("Debe ser un email válido").required("El email es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
});

export const Register = ({ switchAuthHandler }) => {
  const { register: registerUser, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("Formulario enviado con datos:", data);

    try {
      await registerUser(data.name, data.email, data.password, data.username);
      toast.success("Usuario registrado exitosamente");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Ya existe una cuenta con ese correo electrónico");
      } else {
        toast.error("Error al registrar. Intenta de nuevo.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Registrarse</h2>

      <div className="container-input">
        <i className="lni lni-user"></i>
        <input type="text" placeholder="Nombre" {...register("name")} />
      </div>
      {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

      <div className="container-input">
        <i className="lni lni-user"></i>
        <input type="text" placeholder="Username" {...register("username")} />
      </div>
      {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

      <div className="container-input">
        <i className="lni lni-envelope"></i>
        <input type="text" placeholder="Email" {...register("email")} />
      </div>
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <div className="container-input">
        <i className="lni lni-lock-alt"></i>
        <input type="password" placeholder="Password" {...register("password")} />
      </div>
      {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? "Cargando..." : "REGISTRARSE"}
      </button>
    </form>
  );
};
