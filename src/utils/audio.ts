// Web Audio API Synthesizer for rich cartoon sound effects & cheerful music
// Supports 0 - 100 smooth volume control

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 80; // 0 to 100
  private previousVolume: number = 80;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;

  constructor() {
    const savedMute = localStorage.getItem('poop_dodger_muted');
    const savedVol = localStorage.getItem('poop_dodger_volume');
    if (savedVol !== null) {
      const parsed = parseInt(savedVol, 10);
      if (!isNaN(parsed)) {
        this.volume = Math.max(0, Math.min(100, parsed));
      }
    }
    this.isMuted = savedMute === 'true' || this.volume === 0;
    if (this.volume > 0) {
      this.previousVolume = this.volume;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getGainMultiplier(): number {
    if (this.isMuted || this.volume <= 0) return 0;
    return this.volume / 100;
  }

  public getVolume(): number {
    return this.isMuted ? 0 : this.volume;
  }

  public setVolume(newVol: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    this.volume = clamped;
    if (clamped > 0) {
      this.previousVolume = clamped;
      this.isMuted = false;
    } else {
      this.isMuted = true;
    }
    localStorage.setItem('poop_dodger_volume', String(clamped));
    localStorage.setItem('poop_dodger_muted', String(this.isMuted));

    if (this.isMuted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted || this.volume === 0;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted && this.volume === 0) {
      this.volume = this.previousVolume > 0 ? this.previousVolume : 80;
      localStorage.setItem('poop_dodger_volume', String(this.volume));
    }
    localStorage.setItem('poop_dodger_muted', String(muted));
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public toggleMute(): boolean {
    if (this.isMuted || this.volume === 0) {
      this.setVolume(this.previousVolume > 0 ? this.previousVolume : 80);
    } else {
      this.setMuted(true);
    }
    return this.getMuted();
  }

  // Quick cartoon whoosh / pop when dodging a poop
  public playDodgeSound() {
    const mult = this.getGainMultiplier();
    if (mult <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(Math.max(0.002, 0.16 * mult), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Chime when receiving 20s milestone bonus (+20 points)
  public playBonusSound() {
    const mult = this.getGainMultiplier();
    if (mult <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(Math.max(0.002, 0.22 * mult), now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  // Cartoon splat / game over sound
  public playGameOverSound() {
    const mult = this.getGainMultiplier();
    if (mult <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Splat noise
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.18);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(Math.max(0.002, 0.35 * mult), now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // Sad cartoon descending slide
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.55);

      oscGain.gain.setValueAtTime(Math.max(0.002, 0.24 * mult), now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.1);
      osc.stop(now + 0.55);
    } catch {
      // Ignore
    }
  }

  // Level up victory fanfare
  public playLevelUpSound() {
    const mult = this.getGainMultiplier();
    if (mult <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const melody = [
        { f: 440, d: 0.1 },  // A4
        { f: 554.37, d: 0.1 }, // C#5
        { f: 659.25, d: 0.12 }, // E5
        { f: 880, d: 0.35 }, // A5
      ];
      let t = now;
      melody.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(Math.max(0.002, 0.25 * mult), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.85;
      });
    } catch {
      // Ignore
    }
  }

  // Bubbly button click
  public playClickSound() {
    const mult = this.getGainMultiplier();
    if (mult <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

      gain.gain.setValueAtTime(Math.max(0.002, 0.15 * mult), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  // Cheerful cartoon background melody
  public startBgm() {
    if (this.getGainMultiplier() <= 0 || this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isBgmPlaying = true;

      // Play cute looped marimba rhythm
      const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; // C E G C G E
      let step = 0;

      const playStep = () => {
        const mult = this.getGainMultiplier();
        if (!this.isBgmPlaying || mult <= 0 || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(Math.max(0.001, 0.035 * mult), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);

        step++;
        this.bgmTimer = window.setTimeout(playStep, 240);
      };

      playStep();
    } catch {
      // Ignore
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundManager();
