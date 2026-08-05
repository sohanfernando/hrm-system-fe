import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
        <Inbox size={24} />
      </div>
      <p className="text-body font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-caption text-muted">{description}</p>}
      {action}
    </div>
  );
}
