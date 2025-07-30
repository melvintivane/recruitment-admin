export interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    slug: string;
    description: string;
    applicationCount: number;
    viewCount: number;
    status: string;
    type: string;
    yearsOfExperience: number;
    degreeRequired: string;
    careerLevel: string;
    genderPreference: string;
    deadline: string;
    minSalary: number;
    maxSalary: number;
    skills: {
      id: number;
      name: string;
    }[];
    qualifications: {
      id: number;
      name: string;
    }[];
    responsibilities: {
      id: number;
      name: string;
    }[];
    jobCategory: {
      id: number;
      name: string;
      code: string;
      createdAt: string;
      updatedAt: string;
    };
    company: {
      id: string;
      name: string;
      slug: string;
      mobileNumber: string;
      email: string;
      country: string;
      state: string | null;
      city: string | null;
      website: string;
      linkedin: string;
      industry: string;
      foundedYear: number;
      numberOfEmployees: number;
      businessType: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
    country: string;
    state: string | null;
    city: string | null;
    remoteAllowed: boolean | null;
    createdAt: string;
    updatedAt: string;
  };
  candidate: {
    id: string;
    user: {
      id: string;
      userType: string;
      firstName: string;
      lastName: string;
      email: string;
      imagePath: string;
      gender: string;
      roles: {
        roleId: number;
        name: string;
      }[];
      createdAt: string;
      updatedAt: string;
    };
    languages: {
      id: number;
      name: string;
      proficiency: string;
    }[];
    skills: {
      id: number;
      name: string;
    }[];
    experiences: {
      id: number;
      position: string;
      company: string;
      startDate: string;
      endDate: string | null;
      description: string;
      location: string;
      duties: boolean;
    }[];
    educations: {
      id: number;
      degree: string;
      institution: string;
      course: string;
      location: string;
      description: string;
      startDate: string;
      endDate: string
    }[];
    trainings: {
      id: number;
      course: string;
      institution: string;
      startDate: string;
      endDate: string;
      description: string;
      location: string;
    }[];
    cvPath: string;
    linkedin: string;
    professionalSummary: string;
    desiredJobCategory: string;
    country: string;
    state: string | null;
    city: string | null;
    phone: string;
    birthDate: string;
    address: string;
    yearsOfExperience: number;
    desiredJobTitle: string | null;
    status: string;
    profileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  priority: PriorityType;
  applicationSource?: string;
  status: StatusType;
  feedback?: string;
  notes: string;
  cvPath: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusType =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "INTERVIEWED"
  | "HIRED";

export type PriorityType = "UNDEFINED" | "LOW" | "MEDIUM" | "HIGH";

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