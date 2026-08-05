import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "secondary";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary-light text-primary-dark",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  secondary: "bg-secondary-light text-secondary-dark",
};

export function StatCard({ label, value, icon: Icon, tone = "primary" }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-button ${TONE_CLASSES[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-caption text-muted">{label}</p>
        <p className="text-heading text-foreground">{value}</p>
      </div>
    </Card>
  );
}
