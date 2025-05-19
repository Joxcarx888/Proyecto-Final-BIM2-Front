import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from '../shared/validators'; 
import { useRegister } from '../shared/hooks';
import toast from "react-hot-toast";

export const Register = ({ switchAuthHandler }) => {
  const { register: registerUser, isLoading } = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password, data.username);
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
        REGISTRARSE
      </button>
    </form>
  );
};
