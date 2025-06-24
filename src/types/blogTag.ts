// Representa o dado retornado pela API (GET)
export interface BlogTagDTO {
  id: string; // UUID
  name: string;
  code: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Para criação (POST)
export interface BlogTagCreationDTO {
  name: string;
  code: string;
  description?: string;
}

// Para edição (PUT)
export interface BlogTagUpdateDTO {
  name: string;
  code: string;
  description?: string;
}

// Para resposta paginada do backend (Page<BlogTagResponseDTO>)
export interface BlogTagApiResponse {
  content: BlogTagDTO[];
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
