// services/vacancyService.ts
import { VacancyType, VacancyApiResponse } from "../types/vacancy";
import { API_ENDPOINTS } from "../config/api";


export interface VacancyCreateDto {
  title: string;
  description: string;
  companyId: string;
  jobCategoryId: string;
  type: string;
  status: string;
  cityId: number;
  yearsOfExperience: number;
  careerLevel: string;
  degreeRequired: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  genderPreference: string;
  skills: string[];
}


export const createVacancy = async ( vacancyData: VacancyCreateDto ): Promise<VacancyType> => {

  const response = await fetch(`${API_ENDPOINTS.VACANCIES}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vacancyData),
  });

  if (!response.ok) {
    throw new Error("Failed to create vacancy");
  }

  return response.json();
};


export const getAllVacancies = async (page: number = 0, size: number = 10): Promise<VacancyApiResponse> => {

  const response = await fetch(
    `${API_ENDPOINTS.VACANCIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  return response.json();
};


export const getVacancyById = async (vacancyId: string): Promise<VacancyType> => {

  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${vacancyId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch vacancy with ID: ${vacancyId}`);
  }

  return response.json();
};


export const updateVacancy = async ({ vacancyId, data }: { vacancyId: string; data: VacancyType;}): Promise<VacancyType> => {

  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${vacancyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update vacancy");
  }

  return response.json();
};


export const deleteVacancy = async (vacancyId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${vacancyId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category with ID: ${vacancyId}`);
  }
};