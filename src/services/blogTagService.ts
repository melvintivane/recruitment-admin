import {
    BlogTagApiResponse,
    BlogTagCreationDTO,
    BlogTagDTO,
    BlogTagUpdateDTO
} from '@/types/blogTag';
import { API_ENDPOINTS } from '../config/api';

// GET: Todas as tags de blog (paginado)
export const getAllBlogTags = async (): Promise<BlogTagApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erro ao buscar tags de blog');
  }

  return response.json();
};

// GET: Buscar tag por ID
export const getBlogTagById = async (tagId: string): Promise<BlogTagDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}/${tagId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao buscar tag com ID: ${tagId}`);
  }

  return response.json();
};

// GET: Buscar tag por código
export const getBlogTagByCode = async (code: string): Promise<BlogTagDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}/code/${code}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao buscar tag com código: ${code}`);
  }

  return response.json();
};

// POST: Criar nova tag
export const createBlogTag = async (
  data: BlogTagCreationDTO
): Promise<BlogTagDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erro ao criar tag de blog');
  }

  return response.json();
};

// PUT: Atualizar tag existente
export const updateBlogTag = async (
  tagId: string,
  data: BlogTagUpdateDTO
): Promise<BlogTagDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}/${tagId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao atualizar tag com ID: ${tagId}`);
  }

  return response.json();
};

// DELETE: Remover tag
export const deleteBlogTag = async (tagId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_TAGS}/${tagId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao apagar tag com ID: ${tagId}`);
  }
};
