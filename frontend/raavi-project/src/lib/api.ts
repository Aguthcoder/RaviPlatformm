import axios from 'axios';
import Cookies from 'js-cookie';

export type ApiEvent = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  startDate: string;
};

type UpcomingEventsResponse = {
  count: number;
  events: ApiEvent[];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function fetchUpcomingEvents(params?: {
  category?: string;
  limit?: number;
}) {
  const response = await api.get<UpcomingEventsResponse>('/events/upcoming', {
    params,
  });
  return response.data.events;
}

export default api;
