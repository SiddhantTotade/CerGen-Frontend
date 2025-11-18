import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useFetchProfile } from "@/hooks/useProfile";
import { changePasswordSchema, type ChangePasswordForm } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const changePassword = useChangePassword();
  const { data, isError } = useFetchProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePassword.mutate(data, {
      onSuccess: () => toast("Password changed successfully"),
      onError: (err) =>
        console.error("Failed to change password:", err.message),
    });
  };

  return (
    <AuthCard>
      <div className="w-full flex flex-col justify-center gap-3">
        <p>
          <b>Profile</b>
        </p>
        <div className="flex border-b p-3 items-center justify-between">
          <p>
            <small>Welcome, </small><b>{data?.first_name} {data?.last_name}</b>
          </p>
          <small>{data?.email}</small>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm New Password</Label>
              <Input
                id="password2"
                type="password"
                {...register("password2")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password2?.message}
                </p>
              )}
            </div>
          </div>
          {isError}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600"
          >
            Change Password
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
