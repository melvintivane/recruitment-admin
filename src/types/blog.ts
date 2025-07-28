export interface BlogSummaryDTO {
  id: string;
  title: string;
  category?: string;
  author?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTagDTO {
  id: number;
}

export interface BlogResponseDTO {
  id: string;
  title: string;
  category?: string;
  body: string;
  image?: string;
  author?: string;
  commentsCount: number;
  blogCategory: BlogCategoryDTO;
  blogTags: BlogTagDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogCreationDTO {
  title: string;
  body: string;
  image?: string;
  author?: string;
  categoryId: string; // UUID
  tagIds?: number[]; // list of tag IDs (Longs no backend)
}

export interface BlogUpdateDTO {
  title?: string;
  subtitle?: string;
  body?: string;
  quote?: string;
  image?: string;
  author?: string;
  categoryId?: string;
  tagIds?: number[];
}

export interface BlogCategoryDTO {
  id: string;
  name: string;
}

export interface BlogTagDTO {
  id: number;
  name: string;
}

export interface BlogApiResponse {
  content: BlogSummaryDTO[];
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