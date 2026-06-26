import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
          variant === "ghost" && "hover:bg-gray-100 text-gray-700",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          size === "icon" && "h-8 w-8 p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
