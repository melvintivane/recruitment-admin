export interface BlogCategoryDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryCreationDTO {
  name: string;
  code: string;
  description?: string;
}

export interface BlogCategoryUpdateDTO {
  name: string;
  code: string;
  description?: string;
}

export interface BlogCategoryApiResponse {
  content: BlogCategoryDTO[];
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
