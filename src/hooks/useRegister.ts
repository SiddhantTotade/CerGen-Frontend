import { useMutation } from '@tanstack/react-query';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../api/auth';
import { login, register } from '../api/auth';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
};

export const useRegister = ()=>{
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register
  })
}