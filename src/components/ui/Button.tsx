import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "outline" | "ghost"
}

export function Button({ children, variant = "default", className = "", ...props }: ButtonProps) {
  const baseClasses = "button"
  const variantClasses = {
    default: "button-default",
    outline: "button-outline",
    ghost: "button-ghost",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
