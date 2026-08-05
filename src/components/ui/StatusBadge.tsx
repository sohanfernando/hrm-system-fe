type BadgeTone = "success" | "danger" | "warning" | "secondary" | "primary";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
  warning: "bg-warning-light text-warning",
  secondary: "bg-secondary-light text-secondary-dark",
  primary: "bg-primary-light text-primary-dark",
};

/** Maps known employee/payroll statuses to a badge tone. Unknown values fall back to secondary. */
const STATUS_TONE_MAP: Record<string, BadgeTone> = {
  ACTIVE: "success",
  PAID: "success",
  ONBOARDING: "warning",
  PENDING: "warning",
  INACTIVE: "secondary",
  TERMINATED: "danger",
  FAILED: "danger",
};

export interface StatusBadgeProps {
  status: string;
  tone?: BadgeTone;
  className?: string;
}

export function StatusBadge({ status, tone, className = "" }: StatusBadgeProps) {
  const resolvedTone = tone ?? STATUS_TONE_MAP[status] ?? "secondary";
  return (
    <span
      className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-caption font-medium capitalize ${TONE_CLASSES[resolvedTone]} ${className}`}
    >
      {status.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}
