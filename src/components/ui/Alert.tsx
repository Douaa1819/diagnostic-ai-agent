import type { ReactNode } from "react"

interface AlertProps {
  children: ReactNode
  type?: "success" | "error"
}

export function Alert({ children, type = "success" }: AlertProps) {
  return <div className={`alert alert-${type}`}>{children}</div>
}
