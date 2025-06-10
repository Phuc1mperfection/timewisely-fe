import apiClient from './apiClient';

export interface ActivityApiData {
  id?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  color?: string;
  allDay?: boolean; 
  location?: string;
  goalTag?: string;
  completed?: boolean;
}

export const getActivities = async () => {
  const res = await apiClient.get('/activities');
  return res.data;
};

export const createActivity = async (data: ActivityApiData) => {
  const res = await apiClient.post('/activities', data);
  return res.data;
};

export const updateActivity = async (id: string, data: ActivityApiData) => {
  const res = await apiClient.put(`/activities/${id}`, data);
  return res.data;
};

export const deleteActivity = async (id: string) => {
  const res = await apiClient.delete(`/activities/${id}`);
  return res.data;
};
