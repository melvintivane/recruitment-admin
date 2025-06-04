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
}