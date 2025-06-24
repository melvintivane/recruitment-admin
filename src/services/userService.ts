import { UserApiResponse, UserCreationDTO, UserResponseDTO, UserUpdateDTO } from '@/types/user';
import { API_ENDPOINTS } from '../config/api';

export const getAllUsers = async (): Promise<UserApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.USERS}`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch users");
  }

  return response.json();
};

export const getUserById = async (userId: string): Promise<UserResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to fetch user with ID: ${userId}`);
  }

  return response.json();
};

export const createUser = async (userData: UserCreationDTO): Promise<UserResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...userData,
      userType: 'ADMIN' // Default type as in your Java service
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create user");
  }

  return response.json();
};

export const updateUser = async ({
  userId,
  data,
}: {
  userId: string;
  data: UserUpdateDTO;
}): Promise<UserResponseDTO> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to update user with ID: ${userId}`);
  }

  return response.json();
};

export const deleteUser = async (userId: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Failed to delete user with ID: ${userId}`);
  }
};