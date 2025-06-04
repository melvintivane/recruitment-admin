import { API_ENDPOINTS } from '../config/api';
import { CompanyType, CompanyApiResponse } from '@/types/company';

export const getAllCompanies = async (): Promise<CompanyType[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.COMPANIES);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CompanyApiResponse = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error; // Re-throw to let calling code handle it
  }
};