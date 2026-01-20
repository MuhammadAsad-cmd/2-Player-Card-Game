'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { cardTypes, cardCategories, saveCustomCard, getCustomCards, deleteCustomCard } from '../lib/cards';

const CATEGORY_LABELS = {
  [cardCategories.PERSONAL]: 'Personal',
  [cardCategories.CREATIVE]: 'Creative',
  [cardCategories.PHILOSOPHICAL]: 'Philosophical',
  [cardCategories.FUN]: 'Fun',
  [cardCategories.DEEP]: 'Deep',
};

export default function CardCreator({ isOpen, onClose, onCardAdded }) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState(cardTypes.SINGLE_RESPONSE);
  const [category, setCategory] = useState(cardCategories.PERSONAL);
  const [customCards, setCustomCards] = useState(getCustomCards());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      const newCard = saveCustomCard({
        prompt: prompt.trim(),
        type,
        category,
      });
      setCustomCards(getCustomCards());
      setPrompt('');
      if (onCardAdded) onCardAdded(newCard);
    }
  };

  const handleDelete = (cardId) => {
    deleteCustomCard(cardId);
    setCustomCards(getCustomCards());
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#1a1a1a] rounded-2xl p-8 max-w-2xl w-full border border-[#2a2a2a] shadow-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Custom Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#a0a0a0]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Card Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all resize-none"
              rows={4}
              placeholder="Enter your card prompt..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
              >
                <option value={cardTypes.SINGLE_RESPONSE}>Single Response</option>
                <option value={cardTypes.BOTH_RESPONSE}>Both Respond</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Add Card
          </motion.button>
        </form>

        {customCards.length > 0 && (
          <div className="border-t border-[#2a2a2a] pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Custom Cards</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {customCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-[#0f0f0f] p-3 rounded-lg border border-[#2a2a2a] flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{card.prompt}</p>
                    <div className="flex gap-2 text-xs text-[#666666]">
                      <span>{card.type === cardTypes.SINGLE_RESPONSE ? 'Single' : 'Both'}</span>
                      <span>•</span>
                      <span>{CATEGORY_LABELS[card.category]}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-2 hover:bg-[#252525] cursor-pointer rounded-lg transition-colors text-red-400"
                    title="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
