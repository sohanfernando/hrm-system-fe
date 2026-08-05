type AlertVariant = "success" | "danger" | "warning" | "info";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  success: "bg-success-light text-success border-success/20",
  danger: "bg-danger-light text-danger border-danger/20",
  warning: "bg-warning-light text-warning border-warning/20",
  info: "bg-primary-light text-primary-dark border-primary/20",
};

export interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "info", children, className = "" }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-input border px-4 py-3 text-body ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
