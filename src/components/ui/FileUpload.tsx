"use client";

import { useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export interface FileUploadProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  helperText?: string;
  required?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 5,
  error,
  helperText,
  required,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const allowedExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());

  const validateAndSet = (file: File | null) => {
    if (!file) {
      onChange(null);
      setLocalError(undefined);
      return;
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(extension)) {
      setLocalError(`Unsupported file type. Allowed: ${allowedExtensions.join(", ")}`);
      onChange(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File exceeds the maximum size of ${maxSizeMB} MB`);
      onChange(null);
      return;
    }

    setLocalError(undefined);
    onChange(file);
  };

  const displayError = error ?? localError;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-body font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          validateAndSet(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`focus-ring flex cursor-pointer flex-col items-center justify-center gap-2 rounded-input border-2 border-dashed px-4 py-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary"
        } ${displayError ? "border-danger" : ""}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => validateAndSet(event.target.files?.[0] ?? null)}
        />
        <UploadCloud size={28} className="text-muted" />
        {value ? (
          <div className="text-body text-foreground">
            <p className="font-medium">{value.name}</p>
            <p className="text-caption text-muted">{formatBytes(value.size)}</p>
          </div>
        ) : (
          <p className="text-caption text-muted">
            Click to browse or drag a file here ({allowedExtensions.join(", ")}, max {maxSizeMB} MB)
          </p>
        )}
        {value && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              validateAndSet(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="focus-ring text-caption font-medium text-danger hover:underline"
          >
            Remove file
          </button>
        )}
      </div>

      {displayError ? (
        <p className="text-caption text-danger">{displayError}</p>
      ) : helperText ? (
        <p className="text-caption text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
