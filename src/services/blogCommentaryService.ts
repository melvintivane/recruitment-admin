import {
  BlogCommentaryCreationDTO,
  BlogCommentaryPaginatedResponse,
  BlogCommentaryResponseDTO,
  BlogCommentaryUpdateDTO
} from '@/types/blogCommentary';
import { API_ENDPOINTS } from '../config/api';

// GET: Comentários de um blog (paginado)
export const getBlogCommentaries = async (
  blogId: string,
  page: number = 0,
  size: number = 10
): Promise<BlogCommentaryPaginatedResponse> => {
  const url = new URL(API_ENDPOINTS.BLOG_COMMENTARIES);
  url.searchParams.append('blogId', blogId);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('size', size.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao buscar comentários');
  }

  return response.json();
};

// POST: Criar novo comentário
export const createBlogCommentary = async (
  data: BlogCommentaryCreationDTO
): Promise<BlogCommentaryResponseDTO> => {
  const response = await fetch(API_ENDPOINTS.BLOG_COMMENTARIES, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao criar comentário');
  }

  return response.json();
};

// PUT: Atualizar comentário existente
export const updateBlogCommentary = async (
  id: string,
  data: BlogCommentaryUpdateDTO
): Promise<BlogCommentaryResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_COMMENTARIES}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Erro ao atualizar comentário`);
  }

  return response.json();
};

// DELETE: Remover comentário
export const deleteBlogCommentary = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_COMMENTARIES}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Erro ao remover comentário`);
  }
};