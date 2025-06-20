// services/companyService.ts
import { CompanyApiResponse, CompanyType } from '@/types/company';
import { API_ENDPOINTS } from '../config/api';

export interface CompanyCreateDto {
  name: string;
  slug: string;
  picture: string;
  mobileNumber: string;
  email: string;
  website: string;
  linkedin: string;
  country: string
  state: string;
  city: string;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
}

export interface CompanyUpdateDto {
  name?: string;
  slug?: string;
  picture?: string;
  mobileNumber?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  country?: string
  state?: string;
  city?: string;
  industry?: string;
  foundedYear?: number;
  numberOfEmployees?: number;
  businessType?: string;
  description?: string;
}

export const getAllCompanies = async (page: number = 0, size: number = 10): Promise<CompanyApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.COMPANIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch companies");
  }

  return response.json();
};

export const getCompanyById = async (companyId: string): Promise<CompanyType> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to fetch company with ID: ${companyId}`);
  }

  return response.json();
};

export const createCompany = async (companyData: CompanyCreateDto): Promise<CompanyType> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create company");
  }

  return response.json();
};

export const updateCompany = async ({ companyId, data }: { companyId: string; data: CompanyUpdateDto; }): Promise<CompanyUpdateDto> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to update company with ID: ${companyId}`);
  }

  return response.json();
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to delete company with ID: ${companyId}`);
  }
  
  return;
};