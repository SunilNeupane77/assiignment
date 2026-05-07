import axios from 'axios';
import type { Survey, SurveyResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const surveyApi = {
  getSurveys: () => api.get('/surveys'),
  getSurvey: (id: string) => api.get(`/surveys/${id}`),
  createSurvey: (data: Omit<Survey, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => api.post('/surveys', data),
  updateSurvey: (id: string, data: Partial<Survey>) => api.put(`/surveys/${id}`, data),
  deleteSurvey: (id: string) => api.delete(`/surveys/${id}`),
  getDashboardStats: () => api.get('/surveys/stats/dashboard'),
};

export const responseApi = {
  submitResponse: (data: Omit<SurveyResponse, '_id' | 'id' | 'submittedAt'>) => api.post('/responses', data),
  getResponses: (surveyId: string) => api.get(`/responses/survey/${surveyId}`),
  getAnalytics: (surveyId: string) => api.get(`/responses/analytics/${surveyId}`),
  savePartial: (data: Omit<SurveyResponse, '_id' | 'id' | 'submittedAt'>) => api.post('/responses/partial', data),
  getPartial: (surveyId: string, respondentId: string) => api.get(`/responses/partial/${surveyId}/${respondentId}`),
  exportCSV: (surveyId: string) => api.get(`/responses/export/${surveyId}`, { responseType: 'blob' }),
};

export const authApi = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string, role?: string) => 
    api.post('/auth/register', { username, password, role }),
};
