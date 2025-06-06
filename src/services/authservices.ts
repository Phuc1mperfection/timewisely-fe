import apiClient from './apiClient';
import type { User } from '../interfaces/User';

export const login = async (username: string, password: string) => {
  const res = await apiClient.post('/auth/login', { username, password });
  return res.data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await apiClient.post('/auth/register', { username, email, password });
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout', {});
};
