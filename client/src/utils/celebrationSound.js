// Web Audio API sound generator for Café Aroma Birthday Celebration
// Zero dependencies, 100% reliable, zero external MP3 network lag

let audioCtx = null;
let isMuted = false;

export const setSoundMuted = (muted) => {
  isMuted = muted;
};

export const getSoundMuted = () => isMuted;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Tick sound for 3, 2, 1 countdown
export const playTickSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch (err) {
    // Audio policies or unsupported browser
  }
};

// Joyous celebratory fanfare and sparkle burst when gift box opens
export const playCelebrationFanfare = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Harmonious chord notes: C5, E5, G5, C6, E6
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Warm brassy tone
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.09);

      // Volume envelope
      const noteStart = startTime + idx * 0.09;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.75);
    });

    // Magical high sparkle chime overlay
    const sparkles = [1567.98, 1760.0, 2093.0, 2637.02];
    sparkles.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + 0.35 + idx * 0.07);

      const sparkleStart = startTime + 0.35 + idx * 0.07;
      gain.gain.setValueAtTime(0.001, sparkleStart);
      gain.gain.linearRampToValueAtTime(0.08, sparkleStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, sparkleStart + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(sparkleStart);
      osc.stop(sparkleStart + 0.55);
    });
  } catch (err) {
    // Browser audio policy handled safely
  }
};

// Mini pop sound when selecting / clicking an offer card
export const playCardSelectPop = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    // Graceful silence
  }
};
