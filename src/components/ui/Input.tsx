"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full bg-aegis-surface border border-white/10 px-3 py-2 font-mono text-sm text-white placeholder:text-aegis-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aegis-green/50 focus-visible:border-aegis-green/50 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
