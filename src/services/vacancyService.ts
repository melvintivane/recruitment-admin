// services/vacancyService.ts
import { VacancyType, VacancyApiResponse } from "../types/vacancy";
import { API_ENDPOINTS } from "../config/api";

// export const getAllVacancies = async (
//   params?: GetAllVacanciesParams
// ): Promise<VacancyApiResponse> => {
//   const queryParams = new URLSearchParams();

//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined) {
//         queryParams.append(key, String(value));
//       }
//     });
//   }

//   const response = await fetch(`${API_ENDPOINTS.VACANCIES}`);

//   if (!response.ok) {
//     throw new Error('Failed to fetch vacancies');
//   }

//   return response.json();
// };

export interface VacancyCreateDto {
  title: string;
  description: string;
  companyId: string;
  type: string;
  status: string;
  cityId: number;
  yearsOfExperience: number;
  careerLevel: string;
  educationRequired: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  degreeRequired: string;
  requiredSkillIds: number[];
}

export const createVacancy = async (
  vacancyData: VacancyCreateDto
): Promise<VacancyType> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vacancyData),
  });

  if (!response.ok) {
    throw new Error("Failed to create vacancy");
  }

  return response.json();
};

export const getAllVacancies = async (
  page: number = 0,
  size: number = 10
): Promise<VacancyApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.VACANCIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );
  return response.json();
};

export const getVacancyById = async (
  vacancyId: string
): Promise<VacancyType> => {
  const response = await fetch(`${API_ENDPOINTS.VACANCIES}/${vacancyId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch vacancy with ID: ${vacancyId}`);
  }

  return response.json();
};
