import {
    BlogCategoryApiResponse,
    BlogCategoryCreationDTO,
    BlogCategoryDTO,
    BlogCategoryUpdateDTO
} from '@/types/blogCategory';
import { API_ENDPOINTS } from '../config/api';

// GET: Todas as categorias de blog (paginado)
export const getAllBlogCategories = async (): Promise<BlogCategoryApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao buscar categorias de blog");
  }

  return response.json();
};

// GET: Buscar categoria por ID
export const getBlogCategoryById = async (categoryId: string): Promise<BlogCategoryDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}/${categoryId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao buscar categoria com ID: ${categoryId}`);
  }

  return response.json();
};

// GET: Buscar categoria por código
export const getBlogCategoryByCode = async (code: string): Promise<BlogCategoryDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}/code/${code}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao buscar categoria com código: ${code}`);
  }

  return response.json();
};

// POST: Criar nova categoria
export const createBlogCategory = async (
  data: BlogCategoryCreationDTO
): Promise<BlogCategoryDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erro ao criar categoria de blog');
  }

  return response.json();
};

// PUT: Atualizar categoria existente
export const updateBlogCategory = async (
  categoryId: string,
  data: BlogCategoryUpdateDTO
): Promise<BlogCategoryDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}/${categoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao atualizar categoria com ID: ${categoryId}`);
  }

  return response.json();
};

// DELETE: Remover categoria
export const deleteBlogCategory = async (categoryId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_CATEGORIES}/${categoryId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao apagar categoria com ID: ${categoryId}`);
  }
};
