import { PageableType } from "./data";

export interface CompanyType {
  id: string;
  name: string;
  slug: string;
  picture?: string;
  mobileNumber: string;
  email: string;
  website?: string;
  linkedin?: string;
  city: {
    id: number;
    name: string;
    state: {
      id: number;
      name: string;
      country: {
        id: number;
        shortName: string;
        name: string;
        phoneCode: string;
      };
    };
  };
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}



export interface CompanyApiResponse {
  content: CompanyType[];
  pageable: PageableType;
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

export interface CompanyUpdateDto {
  name: string;
  slug: string;
  picture?: string;
  mobileNumber: string;
  email: string;
  website?: string;
  linkedin?: string;
  city: {
    id: string;
  };
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
  updatedAt:string;
  createdAt:string;
}
