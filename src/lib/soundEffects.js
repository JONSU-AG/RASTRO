// Motor de Efectos de Sonido Web Audio API para RASTRO Pomodoro
// 24 opciones gratuitas, sin dependencias externas, con duración máxima de 2 a 4 segundos.

class SoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  play(soundId) {
    try {
      const ctx = this.getAudioContext();
      const sound = SOUND_CATALOG.find(s => s.id === soundId) || SOUND_CATALOG[0];
      sound.playFn(ctx);
    } catch (e) {
      console.warn('Error playing sound:', e);
    }
  }
}

export const soundEngine = new SoundEngine();

export const SOUND_CATALOG = [
  {
    id: 'campana_zen',
    name: 'Campana Zen',
    category: 'Relajantes',
    duration: '3.2s',
    icon: '🧘',
    description: 'Cuenco tibetano armónico con frecuencia relajante de 528Hz',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [528, 1056, 1584].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.2);
      });
    }
  },
  {
    id: 'campana_escolar',
    name: 'Campana Escolar',
    category: 'Clásicos',
    duration: '2.8s',
    icon: '🔔',
    description: 'Doble campanazo universitario clásico de inicio y fin',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [0, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(784, t + delay); // G5
        gain.gain.setValueAtTime(0.28, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 1.8);
      });
    }
  },
  {
    id: 'arpa_astral',
    name: 'Arpa Astral',
    category: 'Cósmicos',
    duration: '3.4s',
    icon: '✨',
    description: 'Arpegio ascendente celestial con resonancia etérea',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const freqs = [392, 493.88, 587.33, 783.99, 987.77, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.12);
        gain.gain.setValueAtTime(0.18, t + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.12);
        osc.stop(t + idx * 0.12 + 1.8);
      });
    }
  },
  {
    id: 'victoria_arcade',
    name: 'Victoria Arcade',
    category: 'Enérgicos',
    duration: '2.4s',
    icon: '👾',
    description: 'Fanfarria 8-bits retro de nivel completado',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.50, d: 0.45 }
      ];
      let cur = 0;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, t + cur);
        gain.gain.setValueAtTime(0.12, t + cur);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + cur + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + cur);
        osc.stop(t + cur + n.d);
        cur += n.d * 0.95;
      });
    }
  },
  {
    id: 'marimba_tropical',
    name: 'Marimba Tropical',
    category: 'Alegres',
    duration: '2.6s',
    icon: '🪵',
    description: 'Golpes cálidos de percusión de madera melodiosa',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.14);
        gain.gain.setValueAtTime(0.24, t + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.14 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.14);
        osc.stop(t + idx * 0.14 + 0.6);
      });
    }
  },
  {
    id: 'cristal_cosmico',
    name: 'Cristal Cósmico',
    category: 'Cósmicos',
    duration: '3.0s',
    icon: '💎',
    description: 'Campana de cristal con armónicos de luz estelar',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [1174.66, 1760, 2349.32].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 2.8);
      });
    }
  },
  {
    id: 'gong_templo',
    name: 'Gong de Templo',
    category: 'Relajantes',
    duration: '3.8s',
    icon: '🪘',
    description: 'Resonancia profunda y expansiva de meditación profunda',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [220, 277.18, 329.63].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.26 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.8);
      });
    }
  },
  {
    id: 'ping_radar',
    name: 'Ping de Radar',
    category: 'Cósmicos',
    duration: '2.2s',
    icon: '📡',
    description: 'Pulso tecnológico nítido de navegación submarina o espacial',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.5);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);
    }
  },
  {
    id: 'fanfarria_triunfal',
    name: 'Fanfarria Triunfal',
    category: 'Enérgicos',
    duration: '3.2s',
    icon: '🎺',
    description: 'Toque de trompetas doradas celebrando la meta',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const notes = [
        { f: 587.33, d: 0.15 },
        { f: 587.33, d: 0.15 },
        { f: 587.33, d: 0.15 },
        { f: 880.00, d: 0.6 }
      ];
      let cur = 0;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, t + cur);
        gain.gain.setValueAtTime(0.12, t + cur);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + cur + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + cur);
        osc.stop(t + cur + n.d);
        cur += n.d * 0.9;
      });
    }
  },
  {
    id: 'flauta_melodica',
    name: 'Flauta Andina',
    category: 'Relajantes',
    duration: '3.0s',
    icon: '🪈',
    description: 'Melodía suave de viento inspirada en el aire de Arequipa',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.22);
        gain.gain.setValueAtTime(0.2, t + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.22 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.22);
        osc.stop(t + idx * 0.22 + 1.2);
      });
    }
  },
  {
    id: 'acordes_piano',
    name: 'Acordes de Piano',
    category: 'Clásicos',
    duration: '3.4s',
    icon: '🎹',
    description: 'Cadencia armónica mayor brillante y elegante',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 698.46, 880.00]
      ];
      chords.forEach((chord, step) => {
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + step * 0.45);
          gain.gain.setValueAtTime(0.18, t + step * 0.45);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 0.45 + 1.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + step * 0.45);
          osc.stop(t + step * 0.45 + 1.9);
        });
      });
    }
  },
  {
    id: 'sintetizador_80s',
    name: 'Sintetizador 80s',
    category: 'Enérgicos',
    duration: '2.8s',
    icon: '🎛️',
    description: 'Onda synthwave retro futurista con gran presencia',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [440, 659.25, 880].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.3);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 2.6);
      });
    }
  },
  {
    id: 'campanillas_viento',
    name: 'Campanillas de Viento',
    category: 'Relajantes',
    duration: '3.5s',
    icon: '🎐',
    description: 'Chimes de bambú y metal mecidos por una brisa suave',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [1318.51, 1567.98, 1760.00, 2093.00, 2637.02].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.15);
        gain.gain.setValueAtTime(0.15, t + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.15 + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.15);
        osc.stop(t + idx * 0.15 + 1.6);
      });
    }
  },
  {
    id: 'gota_espacial',
    name: 'Gota Espacial',
    category: 'Cósmicos',
    duration: '2.5s',
    icon: '💧',
    description: 'Gotas líquidas de energía cósmica',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [0, 0.22, 0.44].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + i * 300, t + delay);
        osc.frequency.exponentialRampToValueAtTime(1600 + i * 400, t + delay + 0.1);
        gain.gain.setValueAtTime(0.3, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.7);
      });
    }
  },
  {
    id: 'laser_energetico',
    name: 'Láser Energético',
    category: 'Enérgicos',
    duration: '2.0s',
    icon: '⚡',
    description: 'Doble pulso láser enfocado y rápido',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t + delay);
        osc.frequency.exponentialRampToValueAtTime(200, t + delay + 0.25);
        gain.gain.setValueAtTime(0.18, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.5);
      });
    }
  },
  {
    id: 'cuerdas_celestiales',
    name: 'Cuerdas Celestiales',
    category: 'Relajantes',
    duration: '3.8s',
    icon: '🎻',
    description: 'Swell orquestal envolvente y tranquilo',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [329.63, 493.88, 659.25].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.02, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.8);
      });
    }
  },
  {
    id: 'xilofono_alegre',
    name: 'Xilófono Alegre',
    category: 'Alegres',
    duration: '2.5s',
    icon: '🎶',
    description: 'Secuencia rítmica optimista de campanas de barra',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.12);
        gain.gain.setValueAtTime(0.25, t + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.12);
        osc.stop(t + idx * 0.12 + 0.7);
      });
    }
  },
  {
    id: 'alarma_digital',
    name: 'Alarma Digital Suave',
    category: 'Clásicos',
    duration: '2.6s',
    icon: '⏰',
    description: 'Beep digital moderno y discreto que no aturde',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [0, 0.25, 0.5].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t + delay);
        gain.gain.setValueAtTime(0.22, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.18);
      });
    }
  },
  {
    id: 'bruma_matutina',
    name: 'Bruma Matutina',
    category: 'Relajantes',
    duration: '3.6s',
    icon: '🌅',
    description: 'Armónicos de amanecer con frecuencia Alpha calmante',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [261.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.6);
      });
    }
  },
  {
    id: 'chime_notificacion',
    name: 'Chime de Notificación',
    category: 'Clásicos',
    duration: '2.2s',
    icon: '📱',
    description: 'Doble campana sutil estilo smartphone premium',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, t);
      gain1.gain.setValueAtTime(0.25, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 1.0);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, t + 0.15);
      gain2.gain.setValueAtTime(0.25, t + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.15);
      osc2.stop(t + 1.8);
    }
  },
  {
    id: 'paso_astral_rastro',
    name: 'Paso Astral RASTRO',
    category: 'Cósmicos',
    duration: '3.2s',
    icon: '🚀',
    description: 'Efecto insignia de RASTRO con salto hiperespacial',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [440, 659.25, 880, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + idx * 0.09 + 0.5);
        gain.gain.setValueAtTime(0.22, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.09 + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + 2.0);
      });
    }
  },
  {
    id: 'onda_relajante',
    name: 'Onda Relajante',
    category: 'Relajantes',
    duration: '3.5s',
    icon: '🌊',
    description: 'Fluctuación binaural suave que despeja la mente',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, t); // 432 Hz frecuencia curativa
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 3.5);
    }
  },
  {
    id: 'clarin_preu',
    name: 'Clarín PREU',
    category: 'Enérgicos',
    duration: '2.8s',
    icon: '📯',
    description: 'Llamado marcial de estudio: ¡a ganar tu vacante!',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      const notes = [
        { f: 440, d: 0.12 },
        { f: 554.37, d: 0.12 },
        { f: 659.25, d: 0.25 },
        { f: 880, d: 0.8 }
      ];
      let cur = 0;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t + cur);
        gain.gain.setValueAtTime(0.22, t + cur);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + cur + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + cur);
        osc.stop(t + cur + n.d);
        cur += n.d * 0.85;
      });
    }
  },
  {
    id: 'despertador_elite',
    name: 'Despertador Élite',
    category: 'Enérgicos',
    duration: '3.0s',
    icon: '🔥',
    description: 'Multi-tono ascendente para reactivarse al 100%',
    playFn: (ctx) => {
      const t = ctx.currentTime;
      [0, 0.2, 0.4, 0.6].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(500 + i * 200, t + delay);
        gain.gain.setValueAtTime(0.12, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.22);
      });
    }
  }
];
