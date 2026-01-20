'use client';

import { motion } from 'framer-motion';
import { cardTypes } from '../lib/cards';
import { useSelector, useDispatch } from 'react-redux';
import { toggleReaction } from '../lib/slices/gameSlice';
import ResponseReactions from './ResponseReactions';

export default function RecapTimeline({ gameHistory, playerNames }) {
  const dispatch = useDispatch();

  const handleToggleReaction = (turnNumber, playerNumber, emoji) => {
    dispatch(toggleReaction({ turnNumber, playerNumber, emoji }));
  };
  if (gameHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#666666] text-lg">No game history available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#2a2a2a] hidden md:block" />

      <div className="space-y-8">
        {gameHistory.map((entry, index) => (
          <motion.div
            key={entry.turnNumber}
            className="relative flex gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Turn number indicator */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#3b82f6] flex items-center justify-center z-10 relative">
                <span className="text-lg font-bold text-[#3b82f6]">{entry.turnNumber}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
              {/* Card Prompt */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wide">
                    {entry.card.type === cardTypes.SINGLE_RESPONSE ? 'Single Response' : 'Both Respond'}
                  </span>
                  <span className="text-xs text-[#666666]">
                    Player {entry.activePlayer} drew
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white leading-relaxed">
                  {entry.card.prompt}
                </h3>
              </div>

              {/* Responses */}
              <div className="space-y-3">
                {entry.responses[1] && (
                  <motion.div
                    className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2a2a2a]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-sm font-semibold text-[#3b82f6]">{playerNames?.[1] || 'Player 1'}</span>
                    </div>
                    <p className="text-[#a0a0a0] leading-relaxed">{entry.responses[1]}</p>
                    {entry.reactions?.[1] && entry.reactions[1].length > 0 && (
                      <ResponseReactions
                        turnNumber={entry.turnNumber}
                        playerNumber={1}
                        reactions={entry.reactions[1]}
                        onToggleReaction={handleToggleReaction}
                      />
                    )}
                  </motion.div>
                )}
                {entry.responses[2] && (
                  <motion.div
                    className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2a2a2a]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                      <span className="text-sm font-semibold text-[#10b981]">{playerNames?.[2] || 'Player 2'}</span>
                    </div>
                    <p className="text-[#a0a0a0] leading-relaxed">{entry.responses[2]}</p>
                    {entry.reactions?.[2] && entry.reactions[2].length > 0 && (
                      <ResponseReactions
                        turnNumber={entry.turnNumber}
                        playerNumber={2}
                        reactions={entry.reactions[2]}
                        onToggleReaction={handleToggleReaction}
                      />
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
