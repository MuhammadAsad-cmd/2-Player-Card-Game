'use client';

import { motion } from 'framer-motion';
import { CreditCard, MessageSquare, Clock, Users } from 'lucide-react';

export default function RecapStatistics({ gameHistory }) {
  const totalCards = gameHistory.length;
  const totalResponses = gameHistory.reduce((count, entry) => {
    return count + (entry.responses[1] ? 1 : 0) + (entry.responses[2] ? 1 : 0);
  }, 0);

  // Calculate game duration if timestamps exist
  const gameDuration = gameHistory.length > 1
    ? Math.round((gameHistory[gameHistory.length - 1].timestamp - gameHistory[0].timestamp) / 1000 / 60)
    : 0;

  // Count responses by player
  const player1Responses = gameHistory.reduce((count, entry) => {
    return count + (entry.responses[1] ? 1 : 0);
  }, 0);
  const player2Responses = gameHistory.reduce((count, entry) => {
    return count + (entry.responses[2] ? 1 : 0);
  }, 0);
  const mostActivePlayer = player1Responses > player2Responses ? 1 : player2Responses > player1Responses ? 2 : null;

  const stats = [
    {
      icon: CreditCard,
      label: 'Cards Played',
      value: totalCards,
      color: 'text-[#3b82f6]',
    },
    {
      icon: MessageSquare,
      label: 'Total Responses',
      value: totalResponses,
      color: 'text-[#10b981]',
    },
    {
      icon: Clock,
      label: 'Duration',
      value: gameDuration > 0 ? `${gameDuration} min` : 'N/A',
      color: 'text-[#f59e0b]',
    },
    {
      icon: Users,
      label: 'Most Active',
      value: mostActivePlayer ? `Player ${mostActivePlayer}` : 'Tie',
      color: 'text-[#8b5cf6]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-sm text-[#a0a0a0] font-medium">{stat.label}</span>
            </div>
            <motion.div
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {stat.value}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
