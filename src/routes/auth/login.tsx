import { useLogin } from "@/hooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema } from "@/schemas/auth";
import type { LoginForm } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/common/AuthCard";
import { GoogleIcon } from "@/assets/google";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate({ to: "/app/home" }),
      onError: (err) => console.error("Login failed:", err.message),
    });
  };

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle>Login to PaperLess</CardTitle>
        <CardDescription className="text-gray-400">
          Fill to Generate
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => navigate({ to: "/auth/register" })}
            >
              Create
            </Button>

            <Button className="cursor-pointer" size="icon">
              <GoogleIcon className="w-1/2" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </AuthCard>
  );
}
