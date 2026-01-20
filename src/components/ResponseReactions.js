'use client';

import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🤔', '🎉'];

export default function ResponseReactions({ 
  turnNumber, 
  playerNumber, 
  reactions = [], 
  onToggleReaction 
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Smile className="w-4 h-4 text-[#666666]" />
      <div className="flex gap-1">
        {EMOJI_OPTIONS.map((emoji) => {
          const isActive = reactions.includes(emoji);
          return (
            <motion.button
              key={emoji}
              onClick={() => onToggleReaction(turnNumber, playerNumber, emoji)}
              className={`text-lg px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#3b82f6]/20 scale-110'
                  : 'hover:bg-[#2a2a2a]'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title={isActive ? 'Remove reaction' : 'Add reaction'}
            >
              {emoji}
            </motion.button>
          );
        })}
      </div>
      {reactions.length > 0 && (
        <span className="text-xs text-[#666666] ml-1">
          {reactions.join(' ')}
        </span>
      )}
    </div>
  );
}
