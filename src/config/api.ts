/* eslint-disable @typescript-eslint/no-explicit-any */

// vacancyService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  COMPANIES: `${API_BASE_URL}/employers`,
  VACANCIES: `${API_BASE_URL}/vacancies`,
  CATEGORIES: `${API_BASE_URL}/vacancies/categories`,
};

