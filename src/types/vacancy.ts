// Base types for nested objects
interface Country {
  id: number;
  shortName: string;
  name: string;
  phoneCode: string;
}

interface State {
  id: number;
  name: string;
  country: Country;
}

interface City {
  id: number;
  name: string;
  state: State;
}

interface JobCategory {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface RequiredSkill {
  id: number;
  name: string;
  jobCategory: JobCategory;
  createdAt: string;
  updatedAt: string;
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
  city: City;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Main Vacancy type
export type VacancyType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'; // Add other types as needed
  status: 'PENDING' | 'CLOSED' | 'ACTIVE'; // Adjust as needed
  yearsOfExperience: number;
  applicationCount: number;
  degreeRequired: string;
  careerLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER'; // Adjust as needed
  genderPreference: 'UNSPECIFIED' | 'MALE' | 'FEMALE';
  applicationDeadline: string;
  remoteAllowed: boolean;
  minSalary: number;
  maxSalary: number;
  requiredSkills: RequiredSkill[];
  company: Company;
  city: City;
  createdAt: string;
  updatedAt: string;
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
  totalPages?: number;
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

// API service function type
export type GetAllVacanciesFn = (
  params?: GetAllVacanciesParams
) => Promise<VacancyApiResponse>;