type SfxName =
  | 'click'
  | 'laser'
  | 'missile'
  | 'ion'
  | 'shield_hit'
  | 'hull_hit'
  | 'explosion'
  | 'power'
  | 'jump'
  | 'victory'
  | 'defeat'
  | 'alarm';

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private musicInterval: ReturnType<typeof setInterval> | null = null;
  private musicStep = 0;
  private initialized = false;
  private musicPlaying = false;
  private ambienceNode: AudioBufferSourceNode | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.25;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.masterGain);

    this.initialized = true;
  }

  async resume(): Promise<void> {
    await this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  playSfx(name: SfxName): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    switch (name) {
      case 'click':
        this.tone(880, 0.05, 'square', 0.08, t);
        break;
      case 'laser':
        this.sweep(1200, 200, 0.15, 'sawtooth', 0.12, t);
        break;
      case 'missile':
        this.tone(150, 0.08, 'triangle', 0.15, t);
        setTimeout(() => this.noise(0.2, 0.2), 80);
        break;
      case 'ion':
        this.tone(300, 0.3, 'sine', 0.1, t);
        this.tone(450, 0.2, 'sine', 0.08, t + 0.1);
        break;
      case 'shield_hit':
        this.tone(600, 0.1, 'sine', 0.15, t);
        this.tone(900, 0.08, 'sine', 0.1, t + 0.05);
        break;
      case 'hull_hit':
        this.noise(0.25, 0.25);
        this.tone(80, 0.3, 'square', 0.15, t);
        break;
      case 'explosion':
        this.noise(0.5, 0.4);
        this.sweep(200, 40, 0.4, 'sawtooth', 0.2, t);
        break;
      case 'power':
        this.tone(440, 0.08, 'sine', 0.1, t);
        this.tone(660, 0.1, 'sine', 0.08, t + 0.08);
        break;
      case 'jump':
        this.sweep(100, 800, 0.6, 'sine', 0.15, t);
        break;
      case 'victory':
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 'sine', 0.12, t + i * 0.15));
        break;
      case 'defeat':
        [400, 350, 300, 200].forEach((f, i) => this.tone(f, 0.3, 'sawtooth', 0.1, t + i * 0.2));
        break;
      case 'alarm':
        this.tone(880, 0.15, 'square', 0.08, t);
        this.tone(660, 0.15, 'square', 0.08, t + 0.2);
        break;
    }
  }

  startMusic(mode: 'menu' | 'combat' | 'map'): void {
    this.stopMusic();
    if (!this.ctx || !this.musicGain) return;
    this.musicPlaying = true;

    const scales: Record<string, number[]> = {
      menu: [130.81, 164.81, 196.0, 246.94, 293.66],
      map: [110.0, 138.59, 164.81, 207.65, 246.94],
      combat: [82.41, 98.0, 116.54, 138.59, 164.81],
    };

    const scale = scales[mode];
    const tempo = mode === 'combat' ? 180 : 120;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.musicPlaying) return;
      const note = scale[this.musicStep % scale.length];
      const bass = scale[0] / 2;
      const t = this.ctx.currentTime;

      if (this.musicStep % 2 === 0) {
        this.tone(bass, 0.4, 'triangle', 0.08, t, this.musicGain);
      }
      if (mode === 'combat' || this.musicStep % 4 === 0) {
        this.tone(note * (1 + (this.musicStep % 3) * 0.25), 0.15, 'sine', 0.06, t, this.musicGain);
      }

      this.musicStep++;
    }, (60 / tempo) * 1000 * 2);
  }

  stopMusic(): void {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicOscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
    this.musicOscillators = [];
  }

  startAmbience(): void {
    if (!this.ctx || !this.musicGain) return;
    this.stopAmbience();

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    this.ambienceNode = this.ctx.createBufferSource();
    this.ambienceNode.buffer = buffer;
    this.ambienceNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;
    gain.connect(this.musicGain);

    this.ambienceNode.connect(filter);
    filter.connect(gain);
    this.ambienceNode.start();
  }

  stopAmbience(): void {
    if (this.ambienceNode) {
      try { this.ambienceNode.stop(); } catch { /* */ }
      this.ambienceNode = null;
    }
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startTime: number,
    dest?: GainNode,
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(dest ?? this.sfxGain!);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private sweep(
    from: number,
    to: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startTime: number,
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, startTime);
    osc.frequency.exponentialRampToValueAtTime(to, startTime + duration);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private noise(duration: number, volume: number): void {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.sfxGain!);
    source.start();
  }
}

export const audio = new AudioManager();
