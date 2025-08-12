export class SoundService {
  private static instance: SoundService;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported');
        this.enabled = false;
      }
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  private createChord(frequencies: number[], duration: number): void {
    frequencies.forEach(freq => this.createTone(freq, duration));
  }

  // Sound effects for different interactions
  playPetTap(): void {
    // Cute pop sound
    this.createTone(800, 0.1, 'square');
  }

  playPirouette(): void {
    // Magical sparkle sound
    const frequencies = [659, 784, 988, 1175]; // E, G, B, D
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.15, 'triangle'), index * 50);
    });
  }

  playAchievement(): void {
    // Victory fanfare
    const melody = [523, 659, 784, 1047]; // C, E, G, C
    melody.forEach((freq, index) => {
      setTimeout(() => this.createTone(freq, 0.3, 'triangle'), index * 150);
    });
  }

  playGoalComplete(): void {
    // Success chime
    this.createChord([523, 659, 784], 0.4); // C major chord
  }

  playButtonTap(): void {
    // Subtle click
    this.createTone(1000, 0.05, 'square');
  }

  playHappyMood(): void {
    // Cheerful chirp
    this.createTone(880, 0.1, 'sine');
    setTimeout(() => this.createTone(1100, 0.1, 'sine'), 100);
  }

  playSadMood(): void {
    // Gentle descending tone
    if (!this.enabled || !this.audioContext) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Error playing sad sound:', error);
    }
  }

  playMoodChange(newMood: string): void {
    switch (newMood) {
      case 'happy':
        this.playHappyMood();
        break;
      case 'sad':
        this.playSadMood();
        break;
      default:
        // Neutral tone
        this.createTone(660, 0.1, 'sine');
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try {
      localStorage.setItem('activegotchi-sound-enabled', JSON.stringify(enabled));
    } catch {}
  }

  isEnabled(): boolean {
    try {
      const stored = localStorage.getItem('activegotchi-sound-enabled');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {}
    return this.enabled;
  }

  constructor() {
    // Initialize sound preference from storage
    this.enabled = this.isEnabled();
  }
}