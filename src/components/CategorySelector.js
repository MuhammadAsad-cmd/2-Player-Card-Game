'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cardCategories } from '../lib/cards';

const CATEGORY_LABELS = {
  [cardCategories.PERSONAL]: { label: 'Personal', icon: '👤', color: 'bg-blue-900/30 text-blue-300' },
  [cardCategories.CREATIVE]: { label: 'Creative', icon: '🎨', color: 'bg-purple-900/30 text-purple-300' },
  [cardCategories.PHILOSOPHICAL]: { label: 'Philosophical', icon: '🤔', color: 'bg-indigo-900/30 text-indigo-300' },
  [cardCategories.FUN]: { label: 'Fun', icon: '🎉', color: 'bg-yellow-900/30 text-yellow-300' },
  [cardCategories.DEEP]: { label: 'Deep', icon: '💭', color: 'bg-gray-900/30 text-gray-300' },
};

export default function CategorySelector({ isOpen, onClose, onConfirm, selectedCategories = null }) {
  const [tempSelected, setTempSelected] = useState(
    selectedCategories || Object.values(cardCategories)
  );

  const toggleCategory = (category) => {
    if (tempSelected.includes(category)) {
      if (tempSelected.length > 1) {
        setTempSelected(tempSelected.filter(c => c !== category));
      }
    } else {
      setTempSelected([...tempSelected, category]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
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
        className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full border border-[#2a2a2a] shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Select Card Categories</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#a0a0a0]" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {Object.entries(CATEGORY_LABELS).map(([category, { label, icon, color }]) => {
            const isSelected = tempSelected.includes(category);
            return (
              <motion.button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#3b82f6]/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-white font-semibold">{label}</span>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-[#3b82f6]" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] cursor-pointer text-white font-semibold rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer text-white font-semibold rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
