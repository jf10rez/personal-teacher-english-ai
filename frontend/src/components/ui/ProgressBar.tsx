interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: string
}

export default function ProgressBar({ value, max, label, color = 'bg-primary' }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">{label}</span>
          <span className="text-sm text-gray-400">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-dark-lighter rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
