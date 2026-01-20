// Sound effects manager (optional, subtle)

class SoundManager {
  constructor() {
    this.enabled = typeof window !== 'undefined' && window.AudioContext;
    this.audioContext = null;
    this.volume = 0.3; // Subtle volume
    this.soundEnabled = true; // Can be toggled via Redux
  }

  setEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  init() {
    if (!this.enabled) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.enabled = false;
    }
  }

  // Generate a subtle sound effect
  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext || !this.soundEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playCardFlip() {
    this.playTone(400, 0.1, 'sine');
    setTimeout(() => this.playTone(500, 0.1, 'sine'), 50);
  }

  playCardDraw() {
    this.playTone(300, 0.15, 'sine');
  }

  playShuffle() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(200 + i * 50, 0.05, 'square');
      }, i * 30);
    }
  }

  playSubmit() {
    this.playTone(600, 0.1, 'sine');
    setTimeout(() => this.playTone(700, 0.1, 'sine'), 50);
  }

  playGameOver() {
    const notes = [400, 500, 600, 700];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 100);
    });
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;
if (soundManager) {
  soundManager.init();
}
