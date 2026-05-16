// Web Audio API implementation for synthetic sound effects without external assets

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(freq: number, type: OscillatorType, duration: number, vol: number, startTime: number) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playXpSound() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  // Cute "bleep-bloop" for XP gain
  playTone(600, 'sine', 0.1, 0.1, now);
  playTone(800, 'sine', 0.15, 0.1, now + 0.1);
}

export function playLevelUpSound() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  // Zelda-like "da-da-da-DAAA"
  playTone(440, 'triangle', 0.15, 0.1, now);
  playTone(493.88, 'triangle', 0.15, 0.1, now + 0.15);
  playTone(523.25, 'triangle', 0.15, 0.1, now + 0.3);
  playTone(659.25, 'triangle', 0.4, 0.15, now + 0.45);
}

export function playAchievementSound() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  // Triumphant chord
  playTone(523.25, 'square', 0.3, 0.05, now);
  playTone(659.25, 'square', 0.3, 0.05, now);
  playTone(783.99, 'square', 0.3, 0.05, now);
  
  playTone(1046.50, 'square', 0.5, 0.08, now + 0.15);
}
