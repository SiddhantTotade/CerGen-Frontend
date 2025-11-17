import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(2, "Enter at least 2 characters for First Name"),

    last_name: z.string().min(2, "Enter at least 2 characters for Last Name"),

    email: z.string().email("Enter a valid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    password2: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Password and Confirm Password do not match",
    path: ["password2"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
    password2: z
      .string()
      .min(6, {
        message: "Confirm new password must be at least 6 characters",
      }),
  })
  .refine((data) => data.password === data.password2, {
    message: "New password and Confirm new password do not match",
    path: ["password2"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
