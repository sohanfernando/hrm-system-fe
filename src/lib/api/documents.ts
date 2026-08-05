import { API_BASE_URL, ApiError, request } from "@/lib/api/client";
import { getToken } from "@/lib/auth";
import type { MessageResponse } from "@/types/common";
import type { DocumentType, EmployeeDocument } from "@/types/employee";

export const documentsApi = {
  list: (employeeId: number) => request<EmployeeDocument[]>(`/employees/${employeeId}/documents`),
  upload: (employeeId: number, file: File, documentType: DocumentType) => {
    const formData = new FormData();
    formData.append("document_type", documentType);
    formData.append("file", file);
    return request<EmployeeDocument>(`/employees/${employeeId}/documents`, {
      method: "POST",
      body: formData,
    });
  },
  remove: (documentId: number) =>
    request<MessageResponse>(`/employees/documents/${documentId}`, { method: "DELETE" }),
  /** Downloads the file client-side using the auth header, then saves it via a blob link. */
  download: async (documentId: number, filename: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/employees/documents/${documentId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) {
      throw new ApiError("Failed to download document", response.status);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
