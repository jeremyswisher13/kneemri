import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "gold" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ucla-blue text-white hover:bg-ucla-dark focus:ring-ucla-blue/50 shadow-sm",
  secondary:
    "border border-ucla-blue text-ucla-blue bg-white hover:bg-ucla-light focus:ring-ucla-blue/50",
  gold: "bg-ucla-gold text-ucla-dark hover:brightness-95 focus:ring-ucla-gold/50 shadow-sm font-semibold",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm rounded-md sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
