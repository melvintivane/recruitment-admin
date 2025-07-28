import {
    BloggerApiResponse,
    BloggerCreationDTO,
    BloggerResponseDTO,
    BloggerUpdateDTO,
} from "@/types/blogger";
import { API_ENDPOINTS } from "../config/api";

// Tipo para parâmetros de paginação
interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

// Função auxiliar para construir query string de paginação
const buildPaginationQuery = (params?: PaginationParams): string => {
  if (!params) return "";

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.sort) queryParams.append("sort", params.sort);

  return queryParams.toString() ? `?${queryParams.toString()}` : "";
};

// GET: Todos os blogs (paginado)
export const getAllBloggers = async (): Promise<BloggerApiResponse> => {
  const queryString = buildPaginationQuery();
  const response = await fetch(`${API_ENDPOINTS.BLOGGERS}${queryString}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch blogs");
  }

  return response.json();
};



// GET: Buscar por ID
export const getBloggerById = async (bloggerId: string): Promise<BloggerResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${bloggerId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Blog not found with ID: ${bloggerId}`);
  }

  return response.json();
};

// POST: Criar novo blog
export const createBlogger = async (
  bloggerData: BloggerCreationDTO
): Promise<BloggerResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGGERS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bloggerData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create blogger");
  }

  return response.json();
};

// PUT: Atualizar blog existente
export const updateBlogger = async (
  bloggerId: string,
  data: BloggerUpdateDTO
): Promise<BloggerResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGGERS}/${bloggerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to update blogger");
  }

  return response.json();
};

// DELETE: Remover blog
export const deleteBlog = async (blogId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || `Failed to delete blog with ID: ${blogId}`
    );
  }
};