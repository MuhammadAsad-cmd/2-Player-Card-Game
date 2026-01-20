'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Share2, Download } from 'lucide-react';
import RecapStatistics from './RecapStatistics';
import RecapTimeline from './RecapTimeline';

export default function GameRecap({ gameHistory, playerNames, onPlayAgain, onResetGame }) {
  const generateFullGameText = () => {
    let text = `🎴 Card Game Recap\n\n`;
    text += `Total Turns: ${gameHistory.length}\n\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    gameHistory.forEach((entry, index) => {
      text += `Turn ${entry.turnNumber}\n`;
      text += `Card: ${entry.card.prompt}\n`;
      text += `Type: ${entry.card.type === 'single-response' ? 'Single Response' : 'Both Respond'}\n`;
      text += `Drawn by: Player ${entry.activePlayer}\n\n`;

      if (entry.responses[1]) {
        text += `${playerNames?.[1] || 'Player 1'}: ${entry.responses[1]}\n`;
      }
      if (entry.responses[2]) {
        text += `${playerNames?.[2] || 'Player 2'}: ${entry.responses[2]}\n`;
      }
      text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    });

    return text;
  };

  const handleShare = async () => {
    const text = generateFullGameText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Card Game Recap',
          text: text,
        });
      } catch (err) {
        // User cancelled or error occurred
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    const text = generateFullGameText();
    try {
      await navigator.clipboard.writeText(text);
      alert('Recap copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0f0f0f] p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <Trophy className="w-20 h-20 mx-auto text-[#fbbf24]" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Game Complete!
          </h1>
          <p className="text-lg text-[#a0a0a0]">
            Here's your complete game journey
          </p>
        </motion.div>

        {/* Statistics */}
        <RecapStatistics gameHistory={gameHistory} />

        {/* Timeline */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Game Timeline</h2>
          <RecapTimeline gameHistory={gameHistory} playerNames={playerNames} />
        </div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 border border-[#3b82f6]/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#252525] cursor-pointer text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 border border-[#2a2a2a]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" />
            Share Full Game
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
