import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("flex h-10 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20", className)} {...props} />; }
