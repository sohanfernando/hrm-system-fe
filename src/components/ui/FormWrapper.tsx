import { FormHTMLAttributes } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export interface FormWrapperProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  error?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/** Consistent layout wrapper for create/edit forms: field stack + error banner + submit/cancel row. */
export function FormWrapper({
  onSubmit,
  children,
  error,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  ...formProps
}: FormWrapperProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" {...formProps}>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="flex flex-col gap-4">{children}</div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
