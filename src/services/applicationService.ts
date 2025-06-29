import { API_ENDPOINTS } from "@/config/api";
import { Application, ApplicationApiResponse, StatusType } from "@/types/application";


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

export const getApplicationsByJob = async (id: string | undefined): Promise<ApplicationApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.JOB_APPLICATIONS}/job/${id}`)

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to fetch applications");
  }

  return response.json();
}

export const updateApplication = async ({ data }: { data: Application;}): Promise<ApplicationApiResponse> => {
  const response = await fetch(`${API_ENDPOINTS.JOB_APPLICATIONS}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Erro ao actualizar candidatura");
  }

  return response.json();
} 

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

export const updateApplicationStatus = async (
  id: string,
  status: StatusType
): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.JOB_APPLICATIONS}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to update application status");
  }
};