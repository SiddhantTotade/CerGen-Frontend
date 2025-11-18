import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
} from "../api/auth";

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};
