import React from "react";
import { useForm } from "react-hook-form";
import { useRegister } from "@/hooks/useRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerSchema } from "@/schemas/auth";
import type { RegisterForm } from "@/schemas/auth";
import { AuthCard } from "@/components/common/AuthCard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { GoogleIcon } from "public/assets/google";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [step, setStep] = React.useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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

  const handleContinue = () => {
    const first = getValues("first_name");
    const last = getValues("last_name");

    if (!first || !last) return alert("Please enter your full name.");

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <AuthCard>
      <CardHeader className="flex">
        <div className="flex flex-col">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Register and get started</CardDescription>
        </div>
        <div className="flex">
          <Button>Login</Button>
          <Button>
            <GoogleIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {step === 2 && (
          <Button
            variant="link"
            onClick={handleBack}
            className="flex p-0 cursor-pointer items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 group flex items-center justify-center gap-2"
                onClick={handleContinue}
              >
                Continue
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input
                  id="password2"
                  type="password"
                  {...register("password2")}
                />
                {errors.password2 && (
                  <p className="text-red-500 text-sm">
                    {errors.password2.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Register
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Register with Google
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </AuthCard>
  );
}
