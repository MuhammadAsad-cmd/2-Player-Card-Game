'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export default function ShareButton({ responses, currentCard }) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    let text = `🎴 Card Game Response\n\n`;
    text += `Card: ${currentCard?.prompt}\n\n`;
    
    if (responses[1]) {
      text += `Player 1: ${responses[1]}\n`;
    }
    if (responses[2]) {
      text += `Player 2: ${responses[2]}\n`;
    }
    
    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Card Game Response',
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
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-lg transition-all duration-200 border border-[#2a2a2a] hover:border-[#3a3a3a]"
      title="Share responses"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </>
      )}
    </button>
  );
}
