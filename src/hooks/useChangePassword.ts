import { changePassword } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../api/auth";

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: changePassword,
  });
};
