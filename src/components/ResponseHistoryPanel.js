'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleReaction } from '../lib/slices/gameSlice';
import ResponseReactions from './ResponseReactions';

export default function ResponseHistoryPanel() {
  const dispatch = useDispatch();
  const gameHistory = useSelector((state) => state.game.gameHistory);
  const playerNames = useSelector((state) => state.game.playerNames);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleReaction = (turnNumber, playerNumber, emoji) => {
    dispatch(toggleReaction({ turnNumber, playerNumber, emoji }));
  };

  if (gameHistory.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-40 bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#252525] transition-all duration-200 shadow-lg ${
          isOpen 
            ? 'right-80 top-4 sm:right-80' 
            : 'right-4 top-1/2 -translate-y-1/2'
        } rounded-l-xl p-3 sm:rounded-l-xl`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <History className="w-5 h-5" />
      </motion.button>

      {/* History Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] z-50 shadow-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
            {/* Header */}
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-[#3b82f6]" />
                Response History
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#252525] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#a0a0a0]" />
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {gameHistory.map((entry, index) => (
                <motion.div
                  key={entry.turnNumber}
                  className="bg-[#0f0f0f] rounded-xl p-4 border border-[#2a2a2a]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Turn Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#3b82f6]">
                      Turn {entry.turnNumber}
                    </span>
                    <span className="text-xs text-[#666666]">
                      {entry.card.type === 'single-response' ? 'Single' : 'Both'}
                    </span>
                  </div>

                  {/* Card Prompt */}
                  <div className="mb-3">
                    <p className="text-sm text-white font-medium leading-relaxed line-clamp-2">
                      {entry.card.prompt}
                    </p>
                  </div>

                  {/* Responses */}
                  <div className="space-y-2">
                    {entry.responses[1] && (
                      <div className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]">
                        <div className="text-xs font-semibold text-[#3b82f6] mb-1">
                          {playerNames?.[1] || 'Player 1'}
                        </div>
                        <p className="text-xs text-[#a0a0a0] line-clamp-2">
                          {entry.responses[1]}
                        </p>
                        {entry.reactions?.[1] && entry.reactions[1].length > 0 && (
                          <ResponseReactions
                            turnNumber={entry.turnNumber}
                            playerNumber={1}
                            reactions={entry.reactions[1]}
                            onToggleReaction={handleToggleReaction}
                          />
                        )}
                      </div>
                    )}
                    {entry.responses[2] && (
                      <div className="bg-[#1a1a1a] rounded-lg p-2 border border-[#2a2a2a]">
                        <div className="text-xs font-semibold text-[#10b981] mb-1">
                          {playerNames?.[2] || 'Player 2'}
                        </div>
                        <p className="text-xs text-[#a0a0a0] line-clamp-2">
                          {entry.responses[2]}
                        </p>
                        {entry.reactions?.[2] && entry.reactions[2].length > 0 && (
                          <ResponseReactions
                            turnNumber={entry.turnNumber}
                            playerNumber={2}
                            reactions={entry.reactions[2]}
                            onToggleReaction={handleToggleReaction}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2a2a2a] text-center">
              <p className="text-xs text-[#666666]">
                {gameHistory.length} {gameHistory.length === 1 ? 'turn' : 'turns'} completed
              </p>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
