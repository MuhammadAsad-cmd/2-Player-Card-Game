'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X } from 'lucide-react';

export default function PlayerNameModal({ isOpen, onClose, onConfirm, playerNames }) {
  const [player1Name, setPlayer1Name] = useState(playerNames[1] || 'Player 1');
  const [player2Name, setPlayer2Name] = useState(playerNames[2] || 'Player 2');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (player1Name.trim() && player2Name.trim()) {
      onConfirm({
        player1: player1Name.trim(),
        player2: player2Name.trim(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full border border-[#2a2a2a] shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-[#3b82f6]" />
              Set Player Names
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-[#a0a0a0]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Player 1 Name
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                placeholder="Enter Player 1 name"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Player 2 Name
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
                placeholder="Enter Player 2 name"
                maxLength={20}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] cursor-pointer text-white font-semibold rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer text-white font-semibold rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Game
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
