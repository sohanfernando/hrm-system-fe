import { Spinner } from "@/components/ui/Spinner";

// Middleware redirects "/" to /dashboard (authenticated) or /login
// (unauthenticated) before this ever renders; this is just a safe fallback.
export default function RootPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" className="text-primary" />
    </div>
  );
}
