export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary text-body font-semibold text-white">
            H
          </div>
          <h1 className="text-heading text-foreground">{title}</h1>
          <p className="text-body text-muted">{description}</p>
        </div>
        <div className="rounded-card border border-border bg-white p-8 shadow-card">{children}</div>
      </div>
    </div>
  );
}
