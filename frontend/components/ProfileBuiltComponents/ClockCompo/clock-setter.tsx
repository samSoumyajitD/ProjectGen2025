import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ClockSetterProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
}

const ClockSetter: React.FC<ClockSetterProps> = ({ value, onChange, max, label }) => {
  const [angle, setAngle] = useState(0);
  const clockRef = useRef<HTMLDivElement>(null);

  // Use localStorage to persist the value
  useEffect(() => {
    const storedValue = localStorage.getItem(label);
    if (storedValue) {
      onChange(Number(storedValue));
    }
  }, [label, onChange]);

  useEffect(() => {
    localStorage.setItem(label, value.toString());
    setAngle((value / max) * 360);
  }, [value, label, max]);

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (clockRef.current) {
      const clockRect = clockRef.current.getBoundingClientRect();
      const clockCenterX = clockRect.left + clockRect.width / 2;
      const clockCenterY = clockRect.top + clockRect.height / 2;

      const pointerX = "clientX" in event ? event.clientX : event.touches[0].clientX;
      const pointerY = "clientY" in event ? event.clientY : event.touches[0].clientY;

      const dx = pointerX - clockCenterX;
      const dy = pointerY - clockCenterY;

      let newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      newAngle = (newAngle + 360) % 360;

      setAngle(newAngle);
      const newValue = Math.round((newAngle / 360) * max);
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div
        ref={clockRef}
        className="relative w-52 h-52 rounded-full bg-white bg-opacity-30 backdrop-blur-lg shadow-xl border border-white border-opacity-20"
      >
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-gray-500 bg-opacity-50"
            style={{
              top: "4px",
              left: "50%",
              transform: `rotate(${(i / max) * 360}deg) translateX(-50%)`,
              transformOrigin: "bottom",
            }}
          />
        ))}
        <motion.div
          className="absolute top-0 left-1/2 w-1 bg-indigo-600 rounded-full origin-bottom"
          style={{ height: "50%", transformOrigin: "bottom center" }}
          drag
          dragElastic={0.1}
          dragMomentum={false}
          onDrag={handleDrag}
          animate={{ rotate: angle }}
        >
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-500 shadow-md rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full shadow-inner" />
          </div>
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">{label}</p>
        <p className="text-4xl font-bold text-indigo-600">{value} hrs</p>
      </div>
    </div>
  );
};

export default ClockSetter;
