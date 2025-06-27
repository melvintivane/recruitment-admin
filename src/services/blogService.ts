import {
  BlogApiResponse,
  BlogCreationDTO,
  BlogResponseDTO,
  BlogUpdateDTO
} from '@/types/blog';
import { API_ENDPOINTS } from '../config/api';

// GET: Todos os blogs (paginado)
export const getAllBlogs = async (): Promise<BlogApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao buscar blogs");
  }

  return response.json();
};

// GET: Últimos blogs (ordenados por data desc)
export const getLatestBlogs = async (): Promise<BlogApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/latest`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao buscar últimos blogs");
  }

  return response.json();
};

// GET: Buscar por ID
export const getBlogById = async (blogId: string): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao buscar blog com ID: ${blogId}`);
  }

  return response.json();
};

// POST: Criar novo blog
export const createBlog = async (blogData: BlogCreationDTO): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erro ao criar blog');
  }

  return response.json();
};

// PUT: Atualizar blog existente
export const updateBlog = async (
  blogId: string,
  blogData: BlogUpdateDTO
): Promise<BlogResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao atualizar blog com ID: ${blogId}`);
  }

  return response.json();
};

// DELETE: Remover blog
export const deleteBlog = async (blogId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao apagar blog com ID: ${blogId}`);
  }
};