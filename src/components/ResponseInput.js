'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';

export default function ResponseInput({ 
  playerNumber, 
  playerName, 
  onSubmit, 
  isRequired,
  isSubmitted,
  submittedResponse 
}) {
  const [response, setResponse] = useState('');

  // Reset local state when response is cleared (new turn)
  useEffect(() => {
    if (!submittedResponse && isSubmitted === false) {
      setResponse('');
    }
  }, [submittedResponse, isSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim()) {
      onSubmit(response);
    }
  };

  if (isSubmitted && submittedResponse) {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
          <span className="text-sm font-semibold text-white">
            {playerName || `Player ${playerNumber}`}:
          </span>
        </div>
        <motion.div
          className="p-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl transition-all duration-300"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white whitespace-pre-wrap wrap-break-word leading-relaxed">
            {submittedResponse}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3">
        <label
          htmlFor={`response-${playerNumber}`}
          className="text-sm font-semibold text-white flex items-center gap-2"
        >
          {playerName || `Player ${playerNumber}`}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.textarea
          id={`response-${playerNumber}`}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response here..."
          className="flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#666666] resize-none transition-all duration-200"
          rows={4}
          required={isRequired}
          whileFocus={{ scale: 1.01, borderColor: '#3b82f6' }}
        />
        <motion.button
          type="submit"
          disabled={!response.trim()}
          className="px-6 py-4 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#2a2a2a] disabled:text-[#666666] disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 border border-[#3b82f6]/50 cursor-pointer"
          whileHover={response.trim() ? { scale: 1.05 } : {}}
          whileTap={response.trim() ? { scale: 0.95 } : {}}
        >
          <Send className="w-4 h-4" />
          Submit
        </motion.button>
      </div>
    </motion.form>
  );
}
