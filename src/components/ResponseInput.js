'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Edit2, Clock, Star } from 'lucide-react';
import ResponseReactions from './ResponseReactions';

export default function ResponseInput({ 
  playerNumber, 
  playerName, 
  onSubmit, 
  onEdit,
  isRequired,
  isSubmitted,
  submittedResponse,
  canEdit = true,
  timestamp = null,
  reactions = [],
  onToggleReaction,
  turnNumber = null,
  isFavorite = false,
  onToggleFavorite,
}) {
  const [response, setResponse] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setResponse(submittedResponse);
    setIsEditing(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (response.trim() && onEdit) {
      onEdit(response);
      setIsEditing(false);
    }
  };

  const characterCount = response.length;
  const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length;

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSubmitted && submittedResponse && !isEditing) {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            <span className="text-sm font-semibold text-white">
              {playerName || `Player ${playerNumber}`}:
            </span>
          </div>
          {canEdit && onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-[#252525] rounded-lg transition-colors text-[#a0a0a0] hover:text-white"
              title="Edit response"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <motion.div
          className="p-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl transition-all duration-300"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white whitespace-pre-wrap wrap-break-word leading-relaxed mb-2">
            {submittedResponse}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              {timestamp && (
                <div className="flex items-center gap-1 text-xs text-[#666666]">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(timestamp)}</span>
                </div>
              )}
              {turnNumber && onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(turnNumber, playerNumber)}
                  className={`p-1 rounded transition-colors ${
                    isFavorite
                      ? 'text-[#fbbf24] hover:text-[#f59e0b]'
                      : 'text-[#666666] hover:text-[#fbbf24]'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
            {turnNumber && onToggleReaction && (
              <ResponseReactions
                turnNumber={turnNumber}
                playerNumber={playerNumber}
                reactions={reactions}
                onToggleReaction={onToggleReaction}
              />
            )}
          </div>
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
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <motion.textarea
              id={`response-${playerNumber}`}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#666666] resize-none transition-all duration-200"
              rows={4}
              required={isRequired}
              whileFocus={{ scale: 1.01, borderColor: '#3b82f6' }}
            />
            {/* Character Counter */}
            <div className="absolute bottom-2 right-3 text-xs text-[#666666]">
              {characterCount} {characterCount === 1 ? 'character' : 'characters'} • {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
          </div>
          <motion.button
            type="submit"
            onClick={isEditing ? handleEditSubmit : handleSubmit}
            disabled={!response.trim()}
            className="px-6 py-4 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#2a2a2a] disabled:text-[#666666] disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 border border-[#3b82f6]/50 cursor-pointer"
            whileHover={response.trim() ? { scale: 1.05 } : {}}
            whileTap={response.trim() ? { scale: 0.95 } : {}}
          >
            <Send className="w-4 h-4" />
            {isEditing ? 'Update' : 'Submit'}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
