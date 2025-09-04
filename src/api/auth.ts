import { apiFetch } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name:string,
  last_name: string,
  email: string;
  password: string;
  password2:string;
}


export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return apiFetch('/auth/api/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const register = (data: RegisterRequest): Promise<RegisterResponse> => {
  return apiFetch('/auth/api/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
