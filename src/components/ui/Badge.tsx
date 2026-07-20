import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "green" | "red" | "amber" | "blue" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/70 border-white/10",
  green: "bg-aegis-green/10 text-aegis-green border-aegis-green/30",
  red: "bg-aegis-red/10 text-aegis-red border-aegis-red/30",
  amber: "bg-aegis-amber/10 text-aegis-amber border-aegis-amber/30",
  blue: "bg-aegis-blue/10 text-aegis-blue border-aegis-blue/30",
  muted: "bg-white/5 text-aegis-muted border-white/5",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
