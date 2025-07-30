import { API_ENDPOINTS } from "@/config/api";
import { Application, ApplicationApiResponse, StatusType } from "@/types/application";


export const downloadCv = async (filename: string): Promise<Blob> => {
  const response = await fetch(`${API_ENDPOINTS.CV_DOWNLOAD}/${filename}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to download CV");
  }

  return response.blob();
};

export const downloadCvWithProgress = async (
  filename: string,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const response = await fetch(`${API_ENDPOINTS.CV_DOWNLOAD}/${filename}`);

  if (!response.ok) {
    throw new Error("Failed to download CV");
  }

  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength) : 0;
  let loaded = 0;

  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];
  
  if (reader) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total > 0) {
        onProgress(Math.round((loaded / total) * 100));
      }
    }
  }

  return new Blob(chunks);
};

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