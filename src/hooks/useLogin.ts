import { useMutation } from '@tanstack/react-query';
import type { LoginRequest, LoginResponse } from '../api/auth';
import { login } from '../api/auth';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
};
