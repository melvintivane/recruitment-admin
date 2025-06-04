/* eslint-disable @typescript-eslint/no-explicit-any */
import { VacancyApiResponse } from "@/types/vacancy";

// vacancyService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  COMPANIES: `${API_BASE_URL}/employers`,
  VACANCIES: `${API_BASE_URL}/vacancies`,
};

export interface GetAllVacanciesParams {
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: any; // Para parâmetros adicionais
}

const getAllVacancies = async (
  params?: GetAllVacanciesParams
): Promise<VacancyApiResponse> => {
  // Cria URL com parâmetros de consulta
  const url = new URL(API_ENDPOINTS.VACANCIES);
  
  // Adiciona parâmetros padrão se não fornecidos
  const defaultParams = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
    sort: params?.sort ?? 'createdAt,desc'
  };

  // Combina parâmetros padrão com os fornecidos
  const finalParams = { ...defaultParams, ...params };

  // Adiciona os parâmetros à URL
  Object.entries(finalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Failed to fetch vacancies');
  }

  return response.json();
};

export default {  getAllVacancies }