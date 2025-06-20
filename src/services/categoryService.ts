import { CategoryType, CategoryCreateDto, CategoryApiResponse } from "../types/category";
import { API_ENDPOINTS } from "../config/api";


export const createCategory = async (categoryData: CategoryCreateDto): Promise<CategoryType> => {
  const response = await fetch(`${API_ENDPOINTS.CATEGORIES}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao criar categoria");
  }

  return response.json();
};



export const getAllCategories = async (page: number = 0, size: number = 10): Promise<CategoryApiResponse> => {

  const response = await fetch(
    `${API_ENDPOINTS.CATEGORIES}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  return response.json();
};


export const getCategoryById = async (categoryId: string): Promise<CategoryType> => {

  const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao buscar categoria");
  }

  return response.json();
};


export const updateCategory = async ({ id, data }: { id: string; data: CategoryType;}): Promise<CategoryType> => {

  const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao atualizar categoria");
  }

  return response.json();
};

export const deleteCategory = async (categoryId: string): Promise<void> => {

  const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao deletar categoria");
  }
  // No content to return on successful deletion
  return;
};
