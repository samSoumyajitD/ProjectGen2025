import type React from "react"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface CircularTimeSelectorProps {
  value: number
  onChange: (value: number) => void
  max: number
  label: string
  color: string
}

const CircularTimeSelector: React.FC<CircularTimeSelectorProps> = ({
  value, onChange, max, label, color
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1)
    }
  }

  return (
    <motion.div
      className="glass-panel rounded-3xl p-6 flex flex-col items-center space-y-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4 p-6 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-lg transition-all">
        {/* Circular Progress Indicator */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              className="stroke-[#e5e5e7] dark:stroke-[#2d2d2f]"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(value / max) * 283} 283`}
              initial={{ strokeDasharray: "0 283" }}
              animate={{ strokeDasharray: `${(value / max) * 283} 283` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>

          {/* Centered Value */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-5xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
              {value}
            </span>
          </motion.div>
        </div>
        
        {/* Label */}
        <p className="text-[15px] font-medium text-[#1d1d1f]  text-center opacity-80">
          {label}
        </p>

        {/* iOS-Inspired Buttons */}
        <div className="flex items-center space-x-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            className="w-14 h-14 flex items-center justify-center rounded-full  transition-all active:scale-95"
            aria-label="Decrement value"
          >
            <Minus className="w-6 h-6 text-black/70 " />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            className="w-14 h-14 flex items-center justify-center rounded-full  transition-all active:scale-95"
            aria-label="Increment value"
          >
            <Plus className="w-6 h-6 text-black/70 " />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default CircularTimeSelector
