import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  background?: "white" | "surface";
}

export function Section({ id, className, children, background = "white" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        background === "surface" && "bg-surface",
        className
      )}
    >
      <div className="section-container">{children}</div>
    </section>
  );
}
