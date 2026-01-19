'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

export default function Card({ card, isRevealed, onFlipComplete, index = 0 }) {
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    
    if (isRevealed && onFlipComplete && !hasCalledComplete.current) {
      const timer = setTimeout(() => {
        onFlipComplete();
        hasCalledComplete.current = true;
      }, 600); // Match the flip animation duration
      return () => clearTimeout(timer);
    }
    // Reset when card changes
    if (!isRevealed) {
      hasCalledComplete.current = false;
    }
  }, [isRevealed, onFlipComplete, card?.id]);

  return (
    <div className="relative w-[320px] h-[400px] perspective-1000">
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isRevealed ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
        initial={false}
      >
        {/* Card Back (Face Down) */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-[#2a2a2a]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)',
            width: '100%',
            height: '100%',
          }}
          animate={{
            opacity: isRevealed ? 0 : 1,
            zIndex: isRevealed ? 0 : 1,
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center p-8 relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CreditCard className="w-20 h-20 mx-auto mb-4 text-[#3b82f6]" strokeWidth={1.5} />
            </motion.div>
            <div className="text-white text-2xl font-semibold tracking-wide mb-2">Card Deck</div>
            <div className="text-[#a0a0a0] text-sm">Tap to reveal</div>
          </div>
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-16 h-16 border border-white rounded-lg"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border border-white rounded-lg"></div>
          </div>
        </motion.div>

        {/* Card Front (Face Up) */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl flex flex-col border-2 border-[#3b82f6]/30"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 50%, #1a1a1a 100%)',
            width: '100%',
            height: '100%',
          }}
          animate={{
            opacity: isRevealed ? 1 : 0,
            zIndex: isRevealed ? 10 : 0,
          }}
          transition={{
            opacity: { duration: 0.1, delay: 0.3 },
          }}
        >
          {/* Decorative corner elements - positioned relative to card */}
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#3b82f6]/40 rounded-lg z-10"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-[#3b82f6]/40 rounded-lg z-10"></div>

          {/* Main content area with proper padding and spacing */}
          <div className="flex-1 flex items-center justify-center px-8 py-12 min-h-0">
            <motion.p
              className="text-white text-2xl md:text-3xl font-medium text-center leading-relaxed wrap-break-word"
              style={{ 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                color: '#ffffff',
              }}
              animate={{
                opacity: isRevealed ? 1 : 0,
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.4 },
              }}
            >
              {card?.prompt || 'No card selected'}
            </motion.p>
          </div>

          {/* Bottom section with fixed positioning */}
          <div className="px-8 pb-6 pt-4 border-t border-[#2a2a2a]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <span className="text-xs text-[#3b82f6] font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                {card?.type === 'single-response' ? (
                  <>
                    <span className="w-2 h-2 bg-[#3b82f6] rounded-full"></span>
                    Other Player Responds
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-[#3b82f6] rounded-full"></span>
                    Both Players Respond
                  </>
                )}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
