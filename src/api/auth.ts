import { apiFetch } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
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

export interface ChangePasswordRequest {
  password: string;
  password2: string;
}

export interface ChangePasswordResponse {
  data: string;
}

export interface ResetPasswordRequest {
  uid: string;
  token: string;
  password: string;
  password2: string;
}

export interface ResetPasswordResponse {
  data: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  data: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return apiFetch("/auth/api/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const register = (data: RegisterRequest): Promise<RegisterResponse> => {
  return apiFetch("/auth/api/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const forgotPassword = (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  return apiFetch("/auth/api/forgot-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const changePassword = (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  return apiFetch("/auth/api/change-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resetPassword = (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return apiFetch(`/auth/api/reset-password/${data.uid}/${data.token}/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const profile = (): Promise<Profile> => {
  return apiFetch("/auth/api/profile/", {
    method: "GET",
  });
};

export const logout = () => {
  return apiFetch("/auth/api/logout/", {
    method: "GET",
  });
};
