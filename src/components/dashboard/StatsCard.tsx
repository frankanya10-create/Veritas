"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  accentColor?: "green" | "blue" | "amber" | "red";
}

const accentStyles = {
  green: {
    border: "border-aegis-green/20",
    icon: "text-aegis-green",
    bg: "bg-aegis-green/[0.03]",
    value: "text-aegis-green",
  },
  blue: {
    border: "border-aegis-blue/20",
    icon: "text-aegis-blue",
    bg: "bg-aegis-blue/[0.03]",
    value: "text-aegis-blue",
  },
  amber: {
    border: "border-aegis-amber/20",
    icon: "text-aegis-amber",
    bg: "bg-aegis-amber/[0.03]",
    value: "text-aegis-amber",
  },
  red: {
    border: "border-aegis-red/20",
    icon: "text-aegis-red",
    bg: "bg-aegis-red/[0.03]",
    value: "text-aegis-red",
  },
};

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  accentColor = "green",
}: StatsCardProps) {
  const styles = accentStyles[accentColor];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-aegis-surface border border-white/[0.06] p-5 transition-all duration-200 hover:border-white/10",
        styles.border
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-8 h-8 flex items-center justify-center", styles.bg)}>
          <Icon className={cn("w-4 h-4", styles.icon)} />
        </div>
        {change && (
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-wider",
              changeType === "positive" && "text-aegis-green",
              changeType === "negative" && "text-aegis-red",
              changeType === "neutral" && "text-aegis-muted"
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className={cn("font-mono text-2xl font-bold mb-1", styles.value)}>
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-aegis-muted">
        {title}
      </div>
    </motion.div>
  );
}
