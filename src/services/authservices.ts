import apiClient from './apiClient';
import type { User } from '../interfaces/User';

export const login = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (email: string, fullName: string, password: string) => {
  const res = await apiClient.post('/auth/register', { email, fullName, password });
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout', {});
};
