/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "../config/api";
import { GetAllVacanciesParams, VacancyApiResponse, VacancyType } from "../types/vacancy";

export interface VacancyCreateDto {
  title: string;
  description: string;
  companyId: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'PENDING' | 'CLOSED' | 'ACTIVE';
  yearsOfExperience: number;
  careerLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER';
  degreeRequired: string;
  genderPreference: 'UNSPECIFIED' | 'MALE' | 'FEMALE';
  deadline: string;
  remoteAllowed: boolean;
  minSalary: number;
  maxSalary: number;
  country: string;
  state: string;
  city: string;
  skills: Array<{ name: string }>;
  qualifications: Array<{ name: string }>;
  responsibilities: Array<{ name: string }>;
}

export const createVacancy = async (vacancyData: any): Promise<VacancyType> => {
  const response = await fetch(API_ENDPOINTS.VACANCIES, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vacancyData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Falha ao criar vaga");
  }

  return response.json();
};

export const getAllVacancies = async (
  params?: GetAllVacanciesParams
): Promise<VacancyApiResponse> => {
  const { page = 0, size = 10, sort = 'createdAt,desc' } = params || {};
  const url = new URL(API_ENDPOINTS.VACANCIES);
  
  url.searchParams.append('page', page.toString());
  url.searchParams.append('size', size.toString());
  url.searchParams.append('sort', sort);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch vacancies");
  }

  return response.json();
};

export const getVacancyById = async (id: string): Promise<VacancyType> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${id}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to fetch vacancy with ID: ${id}`);
  }

  return response.json();
};

export const updateVacancy = async (
  { id, data }: any
): Promise<VacancyType> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to update vacancy with ID: ${id}`);
  }

  return response.json();
};

export const deleteVacancy = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to delete vacancy with ID: ${id}`);
  }
};