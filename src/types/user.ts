// types/user.ts

export enum UserType {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  BLOGGER = 'BLOGGER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  gender?: Gender;
  password?: string; // Only for creation/update
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

// DTO Interfaces
export interface UserCreationDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picture?: string;
  gender?: Gender;
}

export interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
  gender?: Gender;
  password?: string;
}

// Response types
export interface UserResponseDTO {
  id: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  gender?: Gender;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface UserApiResponse {
  content: UserResponseDTO[];
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