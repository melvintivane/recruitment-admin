export interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    country: string;
    company: {
      id: string;
      name: string;
    }
  };
  candidate: {
    id: string;
    name: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      avatarUrl?: string;
    }
  };
  applicationSource?: string;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "REJECTED" | "HIRED";
  priority: "UNDEFINED" | "LOW" | "MEDIUM" | "HIGH";
  feedback?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationApiResponse {
  content: Application[];
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