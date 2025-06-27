// Tipos básicos de usuário para composição
interface UserBasicDTO {
  id: string;
  name: string;
  avatar?: string | null;
}

// Tipos básicos de blog para composição
interface BlogBasicDTO {
  id: string;
  title: string;
}

// DTO para respostas aos comentários
export interface BlogCommentaryResponseDTO {
  id: string;
  commentary: string;
  createdAt: string;
  updatedAt: string;
  user: UserBasicDTO;
  blog: BlogBasicDTO;
  responses?: BlogCommentaryResponseResponseDTO[];
}

// DTO para criação de um novo comentário
export interface BlogCommentaryCreationDTO {
  blogId: string;
  commentary: string;
}

// DTO para atualização de comentário
export interface BlogCommentaryUpdateDTO {
  commentary?: string;
}

// DTO para respostas aos comentários
export interface BlogCommentaryResponseResponseDTO {
  id: string;
  commentary: string;
  createdAt: string;
  updatedAt: string;
  user: UserBasicDTO;
}

// Tipo para resposta paginada genérica
export interface PaginatedApiResponse<T> {
  content: T[];
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

// Tipo específico para resposta paginada de comentários
export type BlogCommentaryPaginatedResponse = PaginatedApiResponse<BlogCommentaryResponseDTO>;