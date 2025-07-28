/* eslint-disable @typescript-eslint/no-explicit-any */

// vacancyService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  COMPANIES: `${API_BASE_URL}/employers`,
  VACANCIES: `${API_BASE_URL}/vacancies`,
  JOB_APPLICATIONS: `${API_BASE_URL}/job-applications`,
  CANDIDATES: `${API_BASE_URL}/candidates`,
  CATEGORIES: `${API_BASE_URL}/vacancies/categories`,
  USERS: `${API_BASE_URL}/users`,
  BLOGS: `${API_BASE_URL}/blogs`,
  BLOG_CATEGORIES: `${API_BASE_URL}/blog-categories`,
  BLOG_TAGS: `${API_BASE_URL}/blog-tags`,
  BLOG_COMMENTARIES: `${API_BASE_URL}/blog-commentaries`,
  BLOGGERS : `${API_BASE_URL}/bloggers`,
};

