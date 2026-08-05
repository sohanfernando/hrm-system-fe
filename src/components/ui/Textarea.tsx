import { TextareaHTMLAttributes, forwardRef, useId } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, required, className = "", rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-body font-medium text-foreground">
            {label}
            {required && <span className="text-danger"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={`focus-ring resize-none rounded-input border bg-white px-3 py-2 text-body text-foreground placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted ${
            error ? "border-danger" : "border-border"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-caption text-danger">{error}</p>
        ) : helperText ? (
          <p className="text-caption text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
