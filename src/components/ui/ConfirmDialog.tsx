import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  /** Shown inside the dialog (e.g. a failed delete's error) instead of behind it on the page. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  isConfirming = false,
  error,
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="flex flex-col gap-3">
        {error && <Alert variant="danger">{error}</Alert>}
        <p className="text-body text-muted">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isConfirming}>
          {variant === "danger" && <Trash2 size={16} />}
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
