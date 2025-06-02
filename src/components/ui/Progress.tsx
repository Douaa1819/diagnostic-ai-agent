interface ProgressProps {
  value: number
}

export function Progress({ value }: ProgressProps) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  )
}
