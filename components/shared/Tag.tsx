import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors",
        variant === "default" && "bg-zinc-100 text-zinc-700",
        variant === "accent" && "bg-accent-light text-accent",
        variant === "outline" && "border border-border text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
