"use client";

import { InputHTMLAttributes, forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, required, type, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (isPasswordVisible ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-body font-medium text-foreground">
            {label}
            {required && <span className="text-danger"> *</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            required={required}
            aria-invalid={Boolean(error)}
            className={`focus-ring h-10 w-full rounded-input border bg-white px-3 text-body text-foreground placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted ${
              isPassword ? "pr-10" : ""
            } ${error ? "border-danger" : "border-border"} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="focus-ring absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-foreground"
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error ? (
          <p className="text-caption text-danger">{error}</p>
        ) : helperText ? (
          <p className="text-caption text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
