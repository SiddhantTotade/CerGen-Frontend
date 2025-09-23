import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Enter a valid email address",
  }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
    first_name: z.string().min(2, {message:"Enter at least 2 characters for First Name"}),
    last_name: z.string().min(2, {message:"Enter at least 2 characters for Last Name"}),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{message:"Enter a valid email address"}),
    password:z.string().min(3,"Password must be at least 6 characters"),
    password2:z.string().min(3, "Confirm Password must be at least 6 characters")
}).refine((data)=>data.password === data.password2,{
    message:"Password and Confirm Password is not matching",
    path:["password2"]
})

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>