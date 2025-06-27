// services/vacancyService.ts
import { API_ENDPOINTS } from "../config/api";
import { VacancyApiResponse, VacancyType } from "../types/vacancy";

export interface VacancyCreateDto {
  title: string;
  description: string;
  companyId: string;
  jobCategoryId: string;
  type: string;
  status: string;
  sector: string;
  country: string;
  state: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: string;
  degreeRequired: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  genderPreference: string;
  remoteAllowed: boolean;
  skills: Array<{ name: string }>;
  qualifications: Array<{ name: string }>;
  responsibilities: Array<{ name: string }>;
}
export interface VacancyUpdateDto {
  title: string;
  description: string;
  companyId: string;
  jobCategoryId: string;
  type: string;
  status: string;
  sector: string;
  country: string;
  state: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: string;
  degreeRequired: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  genderPreference: string;
  remoteAllowed: boolean;
  skills: Array<{ name: string }>;
  qualifications: Array<{ name: string }>;
  responsibilities: Array<{ name: string }>;
}

export const createVacancy = async (vacancyData: VacancyCreateDto) => {
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

export const getAllVacancies = async (page: number = 0, size: number = 10): Promise<VacancyApiResponse> => {

  const response = await fetch(
    `${API_ENDPOINTS.VACANCIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

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
    throw new Error(errorBody.message || "Failed to fetch vacancy with ID: " + id);
  }

  return response.json();
};


export const updateVacancy = async ({ id, data }: { id: string; data: VacancyUpdateDto;}): Promise<VacancyUpdateDto> => {

  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to update vacancy with ID: " + id);
  }

  return response.json();
};


export const deleteVacancy = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to delete vacancy with ID: " + id);
  }

  return;
};