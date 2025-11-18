import { GoogleIcon } from "@/assets/google";
import { AuthCard } from "@/components/common/AuthCard";
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
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => toast(`Reset link sent on ${data?.email}`),
      onError: (err) => console.error("Login failed:", err.message),
    });
  };

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription className="text-gray-400">
          Reset your password
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
          </div>
          <div className="flex flex-col gap-2">
            <Button
              disabled={forgotPasswordMutation.isPending}
              type="submit"
              className="w-full cursor-pointer flex gap-2 bg-blue-500 hover:bg-blue-600"
            >
              {forgotPasswordMutation.isPending && <Spinner />} Send Email
            </Button>
          </div>
        </form>
      </CardContent>
    </AuthCard>
  );
}
