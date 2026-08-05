import Image from "next/image";
import loginRegisterImage from "@/assets/login-register.webp";

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
    <div className="flex h-screen overflow-hidden">
      {/* Image side */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src={loginRegisterImage}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>

      {/* Form side. Scrolls internally (rather than the whole page, which
          would also drag the image along) if content is ever taller than the
          viewport — e.g. the Register form on a short screen. */}
      <div className="flex w-full flex-col items-center overflow-y-auto bg-surface px-4 py-6 lg:w-1/2">
        <div className="m-auto w-full max-w-md py-6">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary text-body font-semibold text-white">
              H
            </div>
            <h1 className="text-heading text-foreground">{title}</h1>
            <p className="text-body text-muted">{description}</p>
          </div>
          <div className="rounded-card border border-border bg-white p-8 shadow-card">{children}</div>
        </div>
      </div>
    </div>
  );
}
