"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError, documentsApi } from "@/lib/api";
import { DOCUMENT_TYPE_OPTIONS, type DocumentType, type EmployeeDocument } from "@/types/employee";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function EmployeeDocumentsSection({ employeeId }: { employeeId: number }) {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("CV_RESUME");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<EmployeeDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentsApi.list(employeeId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  // Fetch this employee's documents on mount / when the employee changes —
  // synchronizing with the server, not something derivable during render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please choose a file to upload.");
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      await documentsApi.upload(employeeId, selectedFile, documentType);
      setSelectedFile(null);
      loadDocuments();
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (doc: EmployeeDocument) => {
    setDownloadingId(doc.id);
    try {
      await documentsApi.download(doc.id, doc.original_file_name);
    } catch {
      setError("Failed to download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingDocument) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await documentsApi.remove(deletingDocument.id);
      setDeletingDocument(null);
      loadDocuments();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="flex flex-col gap-3 rounded-input border border-dashed border-border bg-surface p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <FileUpload label="Document file" value={selectedFile} onChange={setSelectedFile} />
        </div>
        <div className="sm:w-56">
          <Select
            label="Document type"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            options={DOCUMENT_TYPE_OPTIONS}
          />
        </div>
        <Button onClick={handleUpload} isLoading={isUploading} disabled={!selectedFile}>
          Upload
        </Button>
      </div>
      {uploadError && <Alert variant="danger">{uploadError}</Alert>}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted">
          <Spinner size="sm" /> Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents uploaded"
          description="Upload NIC/ID, CV, certificates, or other supporting documents for this employee."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-card border border-border bg-white">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText size={24} className="shrink-0 text-muted" />
                <div className="min-w-0">
                  <p className="truncate text-body font-medium text-foreground">{doc.original_file_name}</p>
                  <p className="text-caption text-muted">
                    {DOCUMENT_TYPE_OPTIONS.find((o) => o.value === doc.document_type)?.label ??
                      doc.document_type}{" "}
                    · {formatBytes(doc.file_size)} · {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(doc)}
                  isLoading={downloadingId === doc.id}
                >
                  Download
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingDocument(doc)}>
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingDocument)}
        title="Delete Document"
        description={`Are you sure you want to delete "${deletingDocument?.original_file_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeletingDocument(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
