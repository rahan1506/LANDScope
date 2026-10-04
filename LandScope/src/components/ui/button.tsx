import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "saffron" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/50 disabled:opacity-40 disabled:pointer-events-none select-none text-center cursor-pointer tracking-tight";

    const variantStyles = {
      // Primary: Electric Azure Intelligence with subtle glow
      primary:
        "bg-[#3b82f6] text-white font-semibold hover:bg-[#60a5fa] active:bg-[#1d4ed8] shadow-md shadow-[#3b82f6]/25 hover:shadow-lg hover:shadow-[#3b82f6]/40 border border-[#93c5fd]/30",
      // Secondary: Deep Forest with illuminated border
      secondary:
        "bg-[#0b1c38] text-[#f8fafc] hover:bg-[#10274e] active:bg-[#0a1f1a] border border-[#3b82f6]/25 shadow-sm",
      // Outline: Translucent Obsidian with emerald border
      outline:
        "bg-[#060e1a]/60 backdrop-blur-md text-[#f8fafc] hover:text-[#3b82f6] hover:bg-[#0b1c38]/50 border border-[#3b82f6]/20 hover:border-[#3b82f6]/50 shadow-sm",
      // Ghost: Subdued translucent
      ghost:
        "bg-transparent text-[#94a3b8] hover:text-white hover:bg-white/5 active:bg-white/10",
      // Saffron / Earth Sand Accent
      saffron:
        "bg-[#f59e0b] text-[#030712] font-semibold hover:bg-[#fde68a] active:bg-[#d97706] border border-[#fde68a]/40 shadow-md shadow-[#f59e0b]/15",
      // Danger: Muted Coral
      danger:
        "bg-[#e47d72]/20 text-[#e47d72] hover:bg-[#e47d72]/30 active:bg-[#e47d72]/40 border border-[#e47d72]/30 shadow-sm",
      // Success: Emerald
      success:
        "bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/30 active:bg-[#3b82f6]/40 border border-[#3b82f6]/30 shadow-sm",
    };

    const sizeStyles = {
      xs: "text-xs px-2.5 py-1 gap-1.5 h-7 text-[11px]",
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-9",
      lg: "text-base px-6 py-2.5 gap-2.5 h-11",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 mr-1.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
