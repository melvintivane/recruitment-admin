// Base types for nested objects

interface Responsibilitie {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ResponsibilitieUpdate {
  name?: string;
}

interface Qualification {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface QualificationUpdate {
  name?: string;
}

interface Skill {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillUpdate {
  name?: string;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  picture?: string;
  mobileNumber: string;
  email: string;
  website?: string;
  linkedin?: string;
  country: string;
  state: string;
  city: string;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyUpdate {
  name?: string;
  picture?: string;
  mobileNumber?: string;
  email?: string;
  website?: string | null;
  linkedin?: string | null;
  country?: string;
  state?: string;
  city?: string;
  industry?: string;
  foundedYear?: number;
  numberOfEmployees?: number;
  businessType?: string;
  description?: string;
}

// Main Vacancy type
export type VacancyType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'PENDING' | 'CLOSED' | 'ACTIVE';
  yearsOfExperience: number;
  applicationCount: number;
  degreeRequired: string;
  jobCategoryId: string;
  careerLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER';
  genderPreference: 'UNSPECIFIED' | 'MALE' | 'FEMALE';
  deadline: string;
  remoteAllowed: boolean;
  minSalary: number;
  maxSalary: number;
  responsibilities: Responsibilitie[];
  qualifications: Qualification[];
  skills: Skill[];
  company: Company;
  country: string;
  state: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export type VacancyUpdate = {
  title?: string;
  description?: string;
  type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status?: 'PENDING' | 'CLOSED' | 'ACTIVE';
  yearsOfExperience?: number;
  degreeRequired?: string;
  careerLevel?: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER';
  genderPreference?: 'UNSPECIFIED' | 'MALE' | 'FEMALE';
  deadline?: string;
  remoteAllowed?: boolean;
  minSalary?: number;
  jobCategoryId?: string;
  maxSalary?: number;
  responsibilities?: ResponsibilitieUpdate[];
  qualifications?: QualificationUpdate[];
  skills?: SkillUpdate[];
  country?: string;
  state?: string;
  city?: string;
}

// Paginated response type
export interface VacancyApiResponse {
  content: VacancyType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// API service types
export type GetAllVacanciesParams = {
  page?: number;
  size?: number;
  sort?: string;
  // Add other filter parameters as needed
};

export type UpdateVacancyParams = {
  id: string;
  data: VacancyUpdate;
};

// API service function types
export type GetAllVacanciesFn = (
  params?: GetAllVacanciesParams
) => Promise<VacancyApiResponse>;

export type UpdateVacancyFn = (
  params: UpdateVacancyParams
) => Promise<VacancyType>;