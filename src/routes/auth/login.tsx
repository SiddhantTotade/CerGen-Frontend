import { useLogin } from "@/hooks/useRegister";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { loginSchema } from "@/schemas/auth";
import type { LoginForm } from "@/schemas/auth";
import { useForm } from "react-hook-form";

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
    <Card className="w-full max-w-sm absolute top-5 left-5">
      <CardHeader>
        <CardTitle>Login to CerGen</CardTitle>
        <CardDescription>
          Fill to Generate
        </CardDescription>
        <CardAction>
          <Button className="cursor-pointer" variant="link">
            Sign Up
          </Button>
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
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
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
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
            <Button variant="outline" className="w-full cursor-pointer">
              Login with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
