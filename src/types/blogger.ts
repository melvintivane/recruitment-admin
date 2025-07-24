export interface BloggerSummaryDTO {
  id: string;
  linkedin: string,
  twitter: string,
  facebook: string,
  password: string,
  user: {
    id: string,
    firstName: string,
    lastName: string,
    gender: string,
    avatar: string,
    about: string,
    email: string,
    createdAt : string,
  }
}


export interface BloggerResponseDTO {
  id: string;
  firstName: string,
  lastName: string,
  gender: string,
  avatar: string,
  about: string,
  email: string,
  linkedin: string,
  twitter: string,
  facebook: string,
  password: string
}

export interface BloggerCreationDTO {
  firstName: string,
  lastName: string,
  gender: string,
  avatar: string,
  about: string,
  email: string,
  linkedin: string,
  twitter: string,
  facebook: string,
  password: string
}

export interface BloggerUpdateDTO {
  firstName?: string,
  lastName?: string,
  gender?: string,
  avatar?: string,
  about?: string,
  email?: string,
  linkedin?: string,
  twitter?: string,
  facebook?: string,
}

export interface BloggerApiResponse {
  content: BloggerSummaryDTO[];
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

