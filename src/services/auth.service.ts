import apiClient from '@/api/client';
import { User } from '@/types';

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  token: string;
};

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/login', credentials);
  return response.data;
}

export const authService = {
  login,
};