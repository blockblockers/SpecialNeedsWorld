// soundUtils.js - Sound utilities for ATLASassist
// Tries to load self-hosted audio files, falls back to Web Audio API synthesis

// Audio Context singleton
let audioContext = null;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Cache for loaded audio buffers
const audioCache = new Map();

// Load an audio file and cache it
export const loadAudio = async (path) => {
  if (audioCache.has(path)) {
    return audioCache.get(path);
  }
  
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Not found');
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioCache.set(path, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.log(`Could not load ${path}, will use synthesized sound`);
    return null;
  }
};

// Play an audio buffer
export const playBuffer = (buffer, volume = 0.6) => {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  return source;
};

// Play audio from path, with synthesized fallback
export const playAudioWithFallback = async (path, fallbackType, volume = 0.6) => {
  const buffer = await loadAudio(path);
  if (buffer) {
    playBuffer(buffer, volume);
    return true;
  } else {
    playSynthesized(fallbackType, volume);
    return false;
  }
};

// Create noise buffer for synthesized sounds
export const createNoiseBuffer = (ctx, duration = 0.5) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

// Synthesized sound generator (fallback when audio files not available)
export const playSynthesized = (type, volume = 0.6) => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  switch (type) {
    // === ANIMALS ===
    case 'dog':
    case 'woof': {
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.25;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(250, startTime);
        osc.frequency.exponentialRampToValueAtTime(150, startTime + 0.15);
        gain.gain.setValueAtTime(volume * 0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      }
      break;
    }
    
    case 'cat':
    case 'meow': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(700, now + 0.2);
      osc.frequency.linearRampToValueAtTime(400, now + 0.6);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
    
    case 'bird':
    case 'chirp': {
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.12;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000 + i * 200, startTime);
        osc.frequency.exponentialRampToValueAtTime(3000 + i * 200, startTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(2000 + i * 200, startTime + 0.08);
        gain.gain.setValueAtTime(volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
      break;
    }
    
    case 'cow':
    case 'moo': {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc2.frequency.setValueAtTime(122, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.5);
      osc2.frequency.linearRampToValueAtTime(142, now + 0.5);
      osc.frequency.linearRampToValueAtTime(100, now + 1.2);
      osc2.frequency.linearRampToValueAtTime(102, now + 1.2);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.2);
      osc2.stop(now + 1.2);
      break;
    }
    
    case 'duck':
    case 'quack': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }
    
    case 'frog':
    case 'ribbit': {
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.15;
        osc.type = 'square';
        osc.frequency.setValueAtTime(180 - i * 30, startTime);
        gain.gain.setValueAtTime(volume * 0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
      break;
    }
    
    // === INSTRUMENTS ===
    case 'drum': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    
    case 'bell': {
      [1, 2, 3, 4].forEach((harmonic) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880 * harmonic, now);
        gain.gain.setValueAtTime(volume * (0.4 / harmonic), now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5 / harmonic);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      });
      break;
    }
    
    case 'piano': {
      const freq = 523;
      [1, 2, 3, 4, 5].forEach((h) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * h, now);
        gain.gain.setValueAtTime(volume * (0.5 / (h * h)), now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1);
      });
      break;
    }
    
    case 'guitar': {
      const freqs = [329, 440, 523, 659, 784];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.02;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1);
      });
      break;
    }
    
    case 'trumpet': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(523, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
    
    case 'xylophone': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
    }
    
    // === VEHICLES ===
    case 'car-horn':
    case 'carHorn': {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc2.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(349, now);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.setValueAtTime(volume * 0.2, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.5);
      break;
    }
    
    case 'train': {
      [1, 1.5, 2].forEach((mult) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 * mult, now);
        gain.gain.setValueAtTime(volume * 0.15, now);
        gain.gain.setValueAtTime(volume * 0.15, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1);
      });
      break;
    }
    
    case 'airplane': {
      const buffer = createNoiseBuffer(ctx, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      break;
    }
    
    case 'boat-horn':
    case 'boatHorn': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.2);
      gain.gain.setValueAtTime(volume * 0.3, now + 1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
      break;
    }
    
    case 'siren': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.5);
      osc.frequency.linearRampToValueAtTime(600, now + 1);
      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1);
      break;
    }
    
    case 'bike-bell':
    case 'bikeBell': {
      const playRing = (startTime) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, startTime);
        gain.gain.setValueAtTime(volume * 0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      };
      playRing(now);
      playRing(now + 0.15);
      break;
    }
    
    // === FUN SOUNDS ===
    case 'pop': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(volume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    }
    
    case 'boing': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(15, now);
      lfoGain.gain.setValueAtTime(50, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      lfo.start(now);
      osc.start(now);
      osc.stop(now + 0.5);
      lfo.stop(now + 0.5);
      break;
    }
    
    case 'whoosh': {
      const buffer = createNoiseBuffer(ctx, 0.5);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      break;
    }
    
    case 'sparkle': {
      const freqs = [2000, 2500, 3000, 2800, 2200];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume * 0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
      break;
    }
    
    case 'laugh': {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.15;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 - i * 20, startTime);
        gain.gain.setValueAtTime(volume * 0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
      break;
    }
    
    case 'applause': {
      for (let i = 0; i < 20; i++) {
        const startTime = now + i * 0.05 + Math.random() * 0.03;
        const buffer = createNoiseBuffer(ctx, 0.08);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000 + Math.random() * 2000, startTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * (0.1 + Math.random() * 0.1), startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(startTime);
      }
      break;
    }
    
    // === MATCH GAME SPECIFIC ===
    case 'whistle': {
      const osc = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      const gain = ctx.createGain();
      vibrato.frequency.setValueAtTime(6, now);
      vibratoGain.gain.setValueAtTime(30, now);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      vibrato.start(now);
      osc.start(now);
      osc.stop(now + 0.8);
      vibrato.stop(now + 0.8);
      break;
    }
    
    case 'buzz': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.setValueAtTime(volume * 0.15, now + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1);
      break;
    }
    
    case 'boop': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    
    case 'horn': {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc2.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc2.frequency.setValueAtTime(270, now);
      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.8);
      osc2.stop(now + 0.8);
      break;
    }
    
    case 'chime': {
      [1, 2, 3, 4].forEach((harmonic) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1047 * harmonic, now);
        gain.gain.setValueAtTime(volume * (0.3 / harmonic), now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2 / harmonic);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2);
      });
      break;
    }
    
    // === FEEDBACK SOUNDS ===
    case 'success': {
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(volume * 0.3, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
      break;
    }
    
    case 'error': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    
    default: {
      // Default beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }
};

export default {
  getAudioContext,
  loadAudio,
  playBuffer,
  playAudioWithFallback,
  playSynthesized,
  createNoiseBuffer,
};
