'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSound } from '../lib/slices/gameSlice';

export default function SoundToggle() {
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state) => state.game.soundEnabled);

  const handleToggle = () => {
    dispatch(toggleSound());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] cursor-pointer rounded-lg hover:bg-[#252525] transition-all duration-200 text-white"
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5 text-[#666666]" />
      )}
    </button>
  );
}
