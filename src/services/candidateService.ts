import { CandidateApiResponse, CandidateType } from '@/types/candidate';
import { API_ENDPOINTS } from '../config/api';

export interface CandidateCreateDto {
  country: string;
  phone: string;
  birthDate: string;
  state?: string;
  city?: string;
  address?: string;
  yearsOfExperience?: number;
  desiredJobTitle: string;
  status?: string;

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  picture?: string;
}

export interface CandidateUpdateDto {
  country?: string;
  phone?: string;
  birthDate?: string;
  state?: string;
  city?: string;
  address?: string;
  yearsOfExperience?: number;
  desiredJobTitle?: string;
  password?: string;
  status?: string;
}

export const getAllCandidates = async (page = 0, size = 10): Promise<CandidateApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.CANDIDATES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch candidates");
  }

  return response.json();
};

export const getCandidateById = async (candidateId: string): Promise<CandidateType> => {
  const response = await fetch(`${API_ENDPOINTS.CANDIDATES}/${candidateId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to fetch candidate with ID: ${candidateId}`);
  }

  return response.json();
};

export const createCandidate = async (candidateData: CandidateCreateDto): Promise<CandidateType> => {
  const response = await fetch(`${API_ENDPOINTS.CANDIDATES}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...candidateData,
      birthDate: new Date(candidateData.birthDate).toISOString()
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create candidate");
  }

  return response.json();
};

export const updateCandidate = async ({
  candidateId,
  data,
}: {
  candidateId: string;
  data: CandidateUpdateDto;
}): Promise<CandidateType> => {
  const payload = data.birthDate
    ? { ...data, birthDate: new Date(data.birthDate).toISOString() }
    : data;

  const response = await fetch(`${API_ENDPOINTS.CANDIDATES}/${candidateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to update candidate with ID: ${candidateId}`);
  }

  return response.json();
};

export const deleteCandidate = async (candidateId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.CANDIDATES}/${candidateId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to delete candidate with ID: ${candidateId}`);
  }
};
