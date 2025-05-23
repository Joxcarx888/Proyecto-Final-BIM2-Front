import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRegister } from "../shared/hooks";
import { useNavigate } from "react-router-dom";
import { useHotels } from "../shared/hooks/useHotels";

const registerSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  username: yup.string().required("El username es obligatorio"),
  email: yup.string().email("Debe ser un email válido").required("El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  hotelId: yup.string().when("isHotelOwner", {
    is: true,
    then: (schema) => schema.required("Debe seleccionar un hotel"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const Register = ({ switchAuthHandler }) => {
  const [isHotelOwner, setIsHotelOwner] = useState(false);
  const { hotels, isLoading: loadingHotels } = useHotels();
  const { register: registerUser, isLoading } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      isHotelOwner: false,
      hotelId: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
        ...(isHotelOwner && { hotel: data.hotelId }),
      };

      await registerUser(
        data.name,
        data.email,
        data.password,
        data.username,
        isHotelOwner ? data.hotelId : null
      );
      
      toast.success("Usuario registrado exitosamente");
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Ya existe una cuenta con ese correo electrónico");
      } else {
        toast.error("Error al registrar. Intenta de nuevo.");
      }
    }
  };

  const handleHotelOwnerClick = () => {
    setIsHotelOwner(true);
    setValue("isHotelOwner", true); 
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

      {isHotelOwner ? (
        <button type="button" className="button" onClick={() => {
          setIsHotelOwner(false);
          setValue("isHotelOwner", false);
          setValue("hotelId", "");
        }}>
          Registrar Usuario
        </button>
      ) : (
        <button type="button" className="button" onClick={handleHotelOwnerClick}>
          Registrar Hotel Owner
        </button>
      )}


      {isHotelOwner && (
        <>
          <div className="container-input">
            <i className="lni lni-home"></i>
            <select {...register("hotelId")} className="styled-select">
              <option value="">Seleccione un hotel</option>
              {loadingHotels ? (
                <option disabled>Cargando hoteles...</option>
              ) : (
                hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {errors.hotelId && <p style={{ color: "red" }}>{errors.hotelId.message}</p>}
        </>
      )}

      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? "Cargando...." : "REGISTRARSE"}
      </button>
    </form>
  );
};
