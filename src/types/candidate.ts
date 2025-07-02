// types/candidate.ts

export enum CandidateStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  // Add other user properties as needed
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Optional, used during creation
  picture?: string; // Optional, used during creation
  gender?: string; // Optional, used during creation
}

export interface CandidateType {
  id: string;
  user: User;
  country: string;
  phone: string;
  birthDate: string; // ISO date string
  state?: string | null;
  city?: string | null;
  address?: string | null;
  password?: string;
  yearsOfExperience?: number | null;
  desiredJobTitle: string;
  status?: CandidateStatus;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface CandidateApiResponse {
  content: CandidateType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// DTO Interfaces
export interface CandidateCreateDto {
  userId: string;
  country: string;
  phone: string;
  birthDate: string; // ISO date string
  state?: string;
  city?: string;
  address?: string;
  yearsOfExperience?: number;
  desiredJobTitle: string;
  password: string;
  status?: CandidateStatus;
}

export interface CandidateUpdateDto {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  gender: string;
  country?: string;
  phone?: string;
  birthDate?: string; // ISO date string
  state?: string;
  city?: string ;
  address?: string;
  yearsOfExperience?: number;
  desiredJobTitle?: string;
  password?: string;
  status?: string;

}

// Response types
export interface ProfileCompletionResponse {
  isComplete: boolean;
  missingFields: string[];
}

export interface CandidateStatusResponse {
  isActive: boolean;
  status: CandidateStatus;
}