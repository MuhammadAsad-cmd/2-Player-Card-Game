'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function PlayerIndicator({ playerNumber, isActive, playerName }) {
  return (
    <motion.div
      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-[#1a1a1a] text-white shadow-lg border border-[#3b82f6]/50'
          : 'bg-[#1a1a1a] text-[#a0a0a0] border border-[#2a2a2a]'
      }`}
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive
          ? '0 10px 25px -5px rgba(59, 130, 246, 0.2)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <div
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isActive ? 'bg-[#3b82f6]' : 'bg-[#666666]'
          }`}
        />
      </motion.div>
      <User
        className={`w-4 h-4 ${isActive ? 'text-[#3b82f6]' : 'text-[#666666]'}`}
        strokeWidth={2}
      />
      <span className="font-semibold text-sm">
        {playerName || `Player ${playerNumber}`}
      </span>
      {isActive && (
        <motion.span
          className="text-xs text-[#3b82f6] ml-1 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          (Active)
        </motion.span>
      )}
    </motion.div>
  );
}
