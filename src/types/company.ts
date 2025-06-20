export interface CompanyType {
  id: string;
  name: string;
  slug: string;
  mobileNumber: string;
  email: string;
  website: string;
  linkedin: string;
  country: string;
  state: string;
  city: string;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
}

export interface CompanyApiResponse {
  content: CompanyType[];
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

export interface CompanyUpdateDto {
  name: string;
  slug: string;
  mobileNumber: string;
  email: string;
  website: string;
  linkedin: string;
  country: string;
  state: string;
  city: string;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
}
