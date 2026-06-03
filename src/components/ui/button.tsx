import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blush-800 text-white shadow-[0_10px_28px_rgba(18,46,89,0.18)] hover:bg-blush-700 focus-visible:ring-blush-700",
  secondary: "border border-blush-200 bg-white/85 text-blush-800 hover:bg-blush-50 focus-visible:ring-blush-200",
  ghost: "text-slate-700 hover:bg-blush-50 focus-visible:ring-blush-200",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-300"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
