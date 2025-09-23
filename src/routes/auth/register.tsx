import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

import { registerSchema } from "@/schemas/auth";
import type { RegisterForm } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password2: data.password2,
      },
      {
        onSuccess: () => navigate({ to: "/app/home" }),
        onError: (err) => console.error("Register failed:", err.message),
      }
    );
  };

  return (
    <Card className="w-full max-w-sm absolute top-5 left-5">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button className="cursor-pointer" variant="link">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input id="password2" type="password" {...register("password2")} />
            {errors.password2 && (
              <p className="text-red-500 text-sm">{errors.password2.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
