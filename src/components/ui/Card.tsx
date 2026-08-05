import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Card({ title, description, actions, className = "", children, ...props }: CardProps) {
  return (
    <div className={`rounded-card border border-border bg-white p-6 shadow-card ${className}`} {...props}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-subheading text-foreground">{title}</h2>}
            {description && <p className="mt-1 text-caption text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
