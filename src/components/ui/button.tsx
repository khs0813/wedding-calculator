import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring",
  secondary: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
  danger: "border border-red-200 bg-card text-red-700 hover:bg-red-50 focus-visible:ring-red-300"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
