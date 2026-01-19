'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function Deck({ cardCount, onDrawCard, canDraw, isShuffling = false }) {
  const handleClick = () => {
    if (canDraw && onDrawCard) {
      onDrawCard();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`relative w-80 h-40 rounded-xl shadow-xl transition-all duration-300 ${
          canDraw
            ? 'hover:scale-110 hover:shadow-2xl active:scale-95 bg-[#1a1a1a] border border-[#3b82f6]/50 cursor-pointer'
            : 'opacity-50 cursor-not-allowed bg-[#1a1a1a] border border-[#2a2a2a]'
        }`}
        onClick={handleClick}
        whileHover={canDraw ? { y: -5 } : {}}
        whileTap={canDraw ? { scale: 0.95 } : {}}
        animate={
          isShuffling
            ? {
                rotate: [0, -5, 5, -5, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }
            : {}
        }
        transition={
          isShuffling
            ? {
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : { duration: 0.2 }
        }
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <motion.div
            animate={canDraw ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Layers className="w-10 h-10 text-[#3b82f6] mb-2" strokeWidth={1.5} />
          </motion.div>
          <div className="text-white text-center">
            <div className="text-2xl font-bold">{cardCount}</div>
            <div className="text-xs font-medium text-[#a0a0a0]">
              {cardCount === 1 ? 'card' : 'cards'}
            </div>
          </div>
        </div>
        {canDraw && (
          <motion.div
            className="absolute -top-2 -right-2 w-5 h-5 bg-[#3b82f6] rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
      <p className="text-sm text-[#a0a0a0] font-medium">
        {cardCount} {cardCount === 1 ? 'card' : 'cards'} remaining
      </p>
    </div>
  );
}
