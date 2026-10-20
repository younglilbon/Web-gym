import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" | "destructive" };

const variants = {
  default: "bg-pine text-white hover:bg-pine/90",
  secondary: "bg-mint text-ink hover:bg-mint/80",
  outline: "border border-ink/15 bg-white hover:bg-cream",
  destructive: "bg-red-600 text-white hover:bg-red-700"
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return <button className={cn("inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)} {...props} />;
}
