import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
  .string()
  .email("Email inválido")
  .required("Email requerido"),
  
  password: yup
  .string()
  .min(8, "Mínimo 8 caracteres")
  .required("Contraseña requerida"),
});

export const registerSchema = yup.object({
  name:yup
  .string()
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .required("Nombre requerido"),

  email: yup
  .string()
  .email("Email inválido")
  .required("Email requerido"),

  username: yup
  .string()
  .min(3, "El usernambe debe tener al menos 3 caracteres")
  .required("Usernambe requerido"),

  password: yup
  .string()
  .min(8, "Mínimo 8 caracteres")
  .required("Contraseña requerida"),

  passwordConfir: yup
  .string()
  .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
  .required('Confirmación requerida'),
});
