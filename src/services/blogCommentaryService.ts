import {
    BlogCommentaryApiResponse,
    BlogCommentaryCreationDTO,
    BlogCommentaryResponseDTO,
    BlogCommentaryUpdateDTO
} from '@/types/blogCommentary';
import { API_ENDPOINTS } from '../config/api';

// GET: Comentários de um blog (paginado)
export const getBlogCommentaries = async (
  blogId: string,
  page: number = 0,
  size: number = 10
): Promise<BlogCommentaryApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.BLOG_COMMENTARIES}?blogId=${blogId}&page=${page}&size=${size}`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erro ao buscar comentários');
  }

  return response.json();
};

// POST: Criar novo comentário
export const createBlogCommentary = async (
  data: Omit<BlogCommentaryCreationDTO, 'userId'> // Não precisa enviar userId pelo front
): Promise<BlogCommentaryResponseDTO> => {
  const payload = {
    ...data,
    userId: "31949db0-acae-4758-93a9-08d247cfb133" // ID fixo temporário
  };

  const response = await fetch(API_ENDPOINTS.BLOG_COMMENTARIES, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Failed to create commentary');
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao atualizar comentário com ID: ${id}`);
  }

  return response.json();
};

// DELETE: Remover comentário
export const deleteBlogCommentary = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.BLOG_COMMENTARIES}/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Erro ao apagar comentário com ID: ${id}`);
  }
};