import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, RegisterResponse } from "../api/auth";
import { register } from "../api/auth";

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
  });
};
