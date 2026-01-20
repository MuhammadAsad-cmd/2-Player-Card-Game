'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

export default function Timer({ duration, onTimeUp, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive || duration === 0) return;

    setTimeLeft(duration);
    setIsWarning(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        if (prev <= 10) {
          setIsWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, isActive, onTimeUp]);

  if (duration === 0) return null;

  const percentage = (timeLeft / duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
        isWarning
          ? 'bg-red-900/20 border-red-500/50 text-red-400'
          : 'bg-[#1a1a1a] border-[#2a2a2a] text-white'
      }`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Clock className={`w-5 h-5 ${isWarning ? 'text-red-400' : 'text-[#3b82f6]'}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          {isWarning && <AlertCircle className="w-4 h-4 text-red-400" />}
        </div>
        <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isWarning ? 'bg-red-500' : 'bg-[#3b82f6]'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
