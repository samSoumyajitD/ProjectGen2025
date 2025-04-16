import type React from "react"
import CircularTimeSelector from "./circular-time-selector"

interface Schedule {
  work: number
  development: number
  personal: number
}

type ScheduleType = "weekday" | "weekend"

interface WeekdayProps {
  schedule: Schedule
  handleInputChange: (type: ScheduleType, field: keyof Schedule, value: number) => void
}

const Weekday: React.FC<WeekdayProps> = ({ schedule, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <CircularTimeSelector
        value={schedule.work}
        onChange={(value) => handleInputChange("weekday", "work", value)}
        max={12}
        label="Work Hours"
        color="rgb(59, 130, 246)"
      />
      <CircularTimeSelector
        value={schedule.development}
        onChange={(value) => handleInputChange("weekday", "development", value)}
        max={8}
        label="Skill Development"
        color="rgb(16, 185, 129)"
      />
      <CircularTimeSelector
        value={schedule.personal}
        onChange={(value) => handleInputChange("weekday", "personal", value)}
        max={8}
        label="Personal Time"
        color="rgb(245, 158, 11)"
      />
    </div>
  )
}

export default Weekday
