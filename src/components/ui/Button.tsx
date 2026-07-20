"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono text-xs tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aegis-green disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-aegis-green text-black border border-aegis-green hover:bg-aegis-green/90 hover:shadow-[0_0_20px_rgba(0,255,102,0.3)]",
        outline:
          "bg-transparent text-white border border-white/10 hover:border-aegis-green/50 hover:text-aegis-green",
        ghost:
          "bg-transparent text-white/60 border border-transparent hover:text-white hover:bg-white/5",
        danger:
          "bg-aegis-red/10 text-aegis-red border border-aegis-red/30 hover:bg-aegis-red/20",
        blue: "bg-aegis-blue text-black border border-aegis-blue hover:bg-aegis-blue/90 hover:shadow-[0_0_20px_rgba(0,170,255,0.3)]",
        cyber:
          "bg-transparent text-white border border-zinc-700 hover:bg-white hover:text-black hover:border-white duration-0",
      },
      size: {
        sm: "h-7 px-3 text-[10px]",
        default: "h-9 px-5 py-2",
        lg: "h-11 px-8 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
