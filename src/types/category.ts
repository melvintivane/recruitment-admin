

export type CategoryType = {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // createdBy?: {
  //   id: string;
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  // };
};

export interface CategoryCreateDto {
  code: string;
  name: string;
}

export interface CategoryUpdateDTO {
  name: string;
  description?: string;
}


export interface CategoryApiResponse {
  content: CategoryType[];
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
