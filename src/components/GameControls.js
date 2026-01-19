'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export default function GameControls({ 
  onDrawCard, 
  onNextTurn, 
  canDrawCard, 
  canNextTurn,
  gamePhase 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {gamePhase === 'waiting' && (
        <motion.button
          onClick={onDrawCard}
          disabled={!canDrawCard}
          className="px-8 py-4 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#2a2a2a] disabled:text-[#666666] text-white cursor-pointer font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 border border-[#3b82f6]/50"
          whileHover={canDrawCard ? { scale: 1.05, y: -2 } : {}}
          whileTap={canDrawCard ? { scale: 0.95 } : {}}
          animate={canDrawCard ? { boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.3)' } : {}}
        >
          <Play className="w-5 h-5" />
          Draw Card
        </motion.button>
      )}
      
      {gamePhase === 'response-complete' && (
        <motion.button
          onClick={onNextTurn}
          disabled={!canNextTurn}
          className="px-8 py-4 bg-[#10b981] hover:bg-[#059669] disabled:bg-[#2a2a2a] disabled:text-[#666666] text-white cursor-pointer font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 border border-[#10b981]/50"
          whileHover={canNextTurn ? { scale: 1.05, y: -2 } : {}}
          whileTap={canNextTurn ? { scale: 0.95 } : {}}
          animate={canNextTurn ? { boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3)' } : {}}
        >
          Next Turn
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
