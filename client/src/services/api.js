import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Supabase JWT access token on every request
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('[AUTH_INTERCEPTOR_WARN]', err);
  }
  return config;
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      details: [error.message],
    };
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, ...errorPayload, status: error.response?.status });
  }
);

// Profile APIs
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// Farm APIs
export const getFarms = () => api.get('/farms');
export const createFarm = (data) => api.post('/farms', data);
export const getFarmById = (id) => api.get(`/farms/${id}`);
export const updateFarm = (id, data) => api.put(`/farms/${id}`, data);
export const deleteFarm = (id) => api.delete(`/farms/${id}`);

// Crop Recommendation APIs
export const recommendCrop = (data) => api.post('/crop/recommend', data);
export const getCropRecommendations = (params) => api.get('/crop/recommendations', { params });
export const getCropRecommendationById = (id) => api.get(`/crop/recommendations/${id}`);
export const deleteCropRecommendation = (id) => api.delete(`/crop/recommendations/${id}`);

// Soil Health APIs
export const analyzeSoil = (data) => api.post('/soil/analyze', data);
export const getSoilReports = (params) => api.get('/soil/reports', { params });
export const getSoilReportById = (id) => api.get(`/soil/reports/${id}`);
export const deleteSoilReport = (id) => api.delete(`/soil/reports/${id}`);

// Fertilizer Advisory APIs
export const recommendFertilizer = (data) => api.post('/fertilizer/recommend', data);
export const getFertilizerAdvisories = (params) => api.get('/fertilizer/advisories', { params });
export const getFertilizerAdvisoryById = (id) => api.get(`/fertilizer/advisories/${id}`);
export const deleteFertilizerAdvisory = (id) => api.delete(`/fertilizer/advisories/${id}`);

// Irrigation Advisory APIs
export const recommendIrrigation = (data) => api.post('/irrigation/recommend', data);
export const getIrrigationAdvisories = (params) => api.get('/irrigation/advisories', { params });
export const getIrrigationAdvisoryById = (id) => api.get(`/irrigation/advisories/${id}`);
export const deleteIrrigationAdvisory = (id) => api.delete(`/irrigation/advisories/${id}`);

// Disease Detection APIs (Supports multipart/form-data for optional image upload)
export const analyzeDisease = (formData) =>
  api.post('/disease/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getDiseaseReports = (params) => api.get('/disease/reports', { params });
export const getDiseaseReportById = (id) => api.get(`/disease/reports/${id}`);
export const deleteDiseaseReport = (id) => api.delete(`/disease/reports/${id}`);

// Cultivation Calendar APIs
export const generateCalendar = (data) => api.post('/calendar/generate', data);
export const getCalendars = (params) => api.get('/calendar', { params });
export const getCalendarById = (id) => api.get(`/calendar/${id}`);
export const updateCalendarActivities = (id, data) => api.put(`/calendar/${id}`, data);
export const deleteCalendar = (id) => api.delete(`/calendar/${id}`);

// AI Chatbot APIs
export const createConversation = (data) => api.post('/chat/conversations', data);
export const getConversations = () => api.get('/chat/conversations');
export const getConversationById = (id) => api.get(`/chat/conversations/${id}`);
export const sendChatMessage = (id, data) => api.post(`/chat/conversations/${id}/messages`, data);
export const deleteConversation = (id) => api.delete(`/chat/conversations/${id}`);

// Dashboard APIs
export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getRecentActivities = () => api.get('/dashboard/recent-activities');
export const getUpcomingTasks = () => api.get('/dashboard/upcoming-tasks');

export default api;

