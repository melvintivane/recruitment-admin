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
  city: {
    id: string;
  };
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
}

export const getAllCompanies = async (page: number = 0, size: number = 10): Promise<CompanyApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.COMPANIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.status}`);
  }

  return response.json();
};

export const getCompanyById = async (companyId: string): Promise<CompanyType> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch company with ID: ${companyId}`);
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
    throw new Error("Failed to create company");
  }

  return response.json();
};

export const updateCompany = async ({ 
  companyId, 
  data 
}: { 
  companyId: string; 
  data: CompanyType;
}): Promise<CompanyType> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update company");
  }

  return response.json();
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.COMPANIES}/${companyId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete company with ID: ${companyId}`);
  }
};