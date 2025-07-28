import {
  BlogApiResponse,
  BlogCreationDTO,
  BlogResponseDTO,
  BlogUpdateDTO,
} from "@/types/blog";
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
export const getAllBlogs = async (): Promise<BlogApiResponse> => {
  const queryString = buildPaginationQuery();
  const response = await fetch(`${API_ENDPOINTS.BLOGS}${queryString}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch blogs");
  }

  return response.json();
};

// GET: Últimos blogs (ordenados por data desc)
export const getLatestBlogs = async (
  pagination?: PaginationParams
): Promise<BlogApiResponse> => {
  const queryString = buildPaginationQuery(pagination);
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/latest${queryString}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch latest blogs");
  }

  return response.json();
};

// GET: Buscar por ID
export const getBlogById = async (blogId: string): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Blog not found with ID: ${blogId}`);
  }

  return response.json();
};

// POST: Criar novo blog
export const createBlog = async (
  blogData: BlogCreationDTO
): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create blog");
  }

  return response.json();
};

// PUT: Atualizar blog existente
export const updateBlog = async (
  blogId: string,
  data: BlogUpdateDTO
): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to update blog");
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

// GET: Buscar por categoria
export const getBlogsByCategory = async (
  categoryId: string,
  pagination?: PaginationParams
): Promise<BlogApiResponse> => {
  const queryString = buildPaginationQuery(pagination);
  const response = await fetch(
    `${API_ENDPOINTS.BLOGS}/category/${categoryId}${queryString}`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message ||
        `Failed to fetch blogs for category ID: ${categoryId}`
    );
  }

  return response.json();
};

// GET: Buscar por tag
export const getBlogsByTag = async (
  tagId: number,
  pagination?: PaginationParams
): Promise<BlogApiResponse> => {
  const queryString = buildPaginationQuery(pagination);
  const response = await fetch(
    `${API_ENDPOINTS.BLOGS}/tag/${tagId}${queryString}`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || `Failed to fetch blogs for tag ID: ${tagId}`
    );
  }

  return response.json();
};

// GET: Busca por termo
export const searchBlogs = async (
  query: string,
  pagination?: PaginationParams
): Promise<BlogApiResponse> => {
  const queryString = buildPaginationQuery(pagination);
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `${API_ENDPOINTS.BLOGS}/search?query=${encodedQuery}${queryString ? `&${queryString}` : ""}`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || `Failed to search blogs for query: ${query}`
    );
  }

  return response.json();
};
