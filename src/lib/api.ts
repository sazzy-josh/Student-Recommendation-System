import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;

      // Re-reading the session runs the NextAuth jwt callback, which refreshes
      // the access token against /auth/refresh/ when it has expired.
      const session = await getSession();

      if (session?.accessToken && !session.error) {
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return api(originalRequest);
      }

      // Refresh failed — clear session and send the user to login.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post('/auth/register/', data),
  refresh: (refresh: string) =>
    api.post('/auth/refresh/', { refresh }),
  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
};

export const recommendationsApi = {
  getRecommendations: () =>
    api.get('/recommendations/'),
  refresh: () =>
    api.post('/recommendations/refresh/'),
  submitFeedback: (id: number, rating: 1 | -1, comment?: string) =>
    api.post(`/recommendations/${id}/feedback/`, { rating, comment }),
  getHistory: () =>
    api.get('/recommendations/history/'),
};

export const coursesApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/courses/', { params }),
  get: (id: number) =>
    api.get(`/courses/${id}/`),
  create: (data: unknown) =>
    api.post('/courses/', data),
  update: (id: number, data: unknown) =>
    api.put(`/courses/${id}/`, data),
  partialUpdate: (id: number, data: unknown) =>
    api.patch(`/courses/${id}/`, data),
  delete: (id: number) =>
    api.delete(`/courses/${id}/`),
  uploadSyllabus: (id: number, file: File) => {
    const form = new FormData();
    form.append('syllabus', file);
    return api.post(`/courses/${id}/syllabus/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDepartments: () =>
    api.get('/courses/departments/'),
};

export const studentApi = {
  getProfile: () => api.get('/students/me/'),
  updateProfile: (data: unknown) => api.put('/students/me/', data),
  getEnrollments: () => api.get('/students/me/enrollments/'),
  addEnrollment: (courseId: number) => api.post('/students/me/enrollments/', { course: courseId }),
  removeEnrollment: (courseId: number) => api.delete(`/students/me/enrollments/${courseId}/`),
  logInteraction: (courseId: number, clicks: number, timeSpent: number) =>
    api.post('/students/me/interactions/', { course_id: courseId, clicks, time_spent_seconds: timeSpent }),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics/'),
  getSettings: () => api.get('/admin/settings/'),
  updateSettings: (data: unknown) => api.put('/admin/settings/', data),
  retrain: () => api.post('/admin/engine/retrain/'),
  getStudents: () => api.get('/admin/students/'),
  getRecommendationAudit: () => api.get('/admin/analytics/recommendations/'),
};
