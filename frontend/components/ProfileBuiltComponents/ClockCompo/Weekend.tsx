import type React from "react"
import CircularTimeSelector from "./circular-time-selector"

interface Schedule {
  development: number
  personal: number
}

type ScheduleType = "weekday" | "weekend"

interface WeekendProps {
  schedule: Schedule
  handleInputChange: (type: ScheduleType, field: keyof Schedule, value: number) => void
}

const Weekend: React.FC<WeekendProps> = ({ schedule, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CircularTimeSelector
        value={schedule.development}
        onChange={(value) => handleInputChange("weekend", "development", value)}
        max={12}
        label="Skill Development"
        color="rgb(16, 185, 129)"
      />
      <CircularTimeSelector
        value={schedule.personal}
        onChange={(value) => handleInputChange("weekend", "personal", value)}
        max={16}
        label="Personal Time"
        color="rgb(245, 158, 11)"
      />
    </div>
  )
}

export default Weekend
