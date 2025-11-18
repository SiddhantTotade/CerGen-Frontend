import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordForm } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/auth/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/reset-password" });
  // @ts-ignore
  const { token, uid } = search;
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordForm) => {
    resetPasswordMutation.mutate(
      { ...data, uid, token },
      {
        onSuccess: () => navigate({ to: "/auth/login" }),
        onError: (err) => console.error("Login failed:", err.message),
      }
    );
  };

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription className="text-gray-400">
          Request password reset
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
          </div>
        </CardAction>
      </CardHeader>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Confirm New Password</Label>
            <Input id="password2" type="password" {...register("password2")} />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password2?.message}
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600"
        >
          Change Password
        </Button>
      </form>
    </AuthCard>
  );
}
