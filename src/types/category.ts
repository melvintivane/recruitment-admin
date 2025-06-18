import { PageableType } from "./data";

export type CategoryType = {
  id: string;
  code: string;
  name: string;
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

export interface CategoryApiResponse {
  content: CategoryType[];
  pageable: PageableType;
}
