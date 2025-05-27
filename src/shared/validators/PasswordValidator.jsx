import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("Email requerido"),
});

export const tokenValidationSchema = yup.object({
  token: yup
    .string()
    .length(64, "Token inválido")
    .required("Token requerido"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .required("Contraseña requerida")
});

