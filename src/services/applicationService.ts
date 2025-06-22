import { API_ENDPOINTS } from "@/config/api";
import { ApplicationApiResponse } from "@/types/application";


export const getApplications = async (page: number = 0, size: number = 10): Promise<ApplicationApiResponse> => {
  const response = await fetch(
    `${API_ENDPOINTS.JOB_APPLICATIONS}?page=${page}&size=${size}&sort=createdAt,desc`
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch applications");
  }

  return response.json();
};

export const deleteApplication = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.JOB_APPLICATIONS}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to delete application with ID: " + id);
  }

  return;
};