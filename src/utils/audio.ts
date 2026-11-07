/**
 * Web Audio API synthesized sound effects and focus ambient audio generator.
 * No external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = (type: 'click' | 'complete' | 'levelUp' | 'bell' | 'badge') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'complete') {
      // Pleasant dual tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now + 0.16);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === 'levelUp') {
      // Triumphant chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + 0.65);
      });
    } else if (type === 'bell') {
      // Tibetan bell / focus timer finish
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'badge') {
      [600, 900, 1200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + 0.5);
      });
    }
  } catch {
    // Graceful fallback if audio is restricted
  }
};

/**
 * Ambient Noise Generator for Focus Mode
 */
let ambientNode: AudioNode | null = null;
let ambientGain: GainNode | null = null;

export const startAmbientSound = (soundType: 'rain' | 'whitenoise' | 'drone' | 'off') => {
  stopAmbientSound();
  if (soundType === 'off') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (soundType === 'rain') {
        // Pink / soft rain noise
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (soundType === 'drone') {
        // Warm low rumble
        output[i] = (lastOut + 0.005 * white) / 1.005;
        lastOut = output[i];
        output[i] *= 5.0;
      } else {
        // Soft white noise
        output[i] = white * 0.3;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = soundType === 'drone' ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(soundType === 'drone' ? 180 : 800, ctx.currentTime);

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.06, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    whiteNoise.start();
    ambientNode = whiteNoise;
  } catch {
    // Ignore audio errors
  }
};

export const stopAmbientSound = () => {
  try {
    if (ambientNode) {
      (ambientNode as AudioBufferSourceNode).stop?.();
      ambientNode.disconnect();
      ambientNode = null;
    }
    if (ambientGain) {
      ambientGain.disconnect();
      ambientGain = null;
    }
  } catch {
    // Ignore
  }
};
