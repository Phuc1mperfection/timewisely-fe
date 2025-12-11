declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export type NotificationSoundType = "default" | "bell" | "chime";
export type PomodoroSoundType = "default" | "alarm" | "gong";

interface SoundSettings {
  enabled: boolean;
  volume: number;
  notificationSound: NotificationSoundType;
  pomodoroSound: PomodoroSoundType;
}

class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5; // 0-1
  private notificationSound: NotificationSoundType = "default";
  private pomodoroSound: PomodoroSoundType = "default";

  constructor() {
    this.loadSettings();
    this.initializeAudio();
  }

  private loadSettings(): void {
    const settings = localStorage.getItem("soundSettings");
    if (settings) {
      const parsed: Partial<SoundSettings> = JSON.parse(settings);
      this.enabled = parsed.enabled ?? true;
      this.volume = parsed.volume ?? 0.5;
      this.notificationSound = parsed.notificationSound ?? "default";
      this.pomodoroSound = parsed.pomodoroSound ?? "default";
    }
  }

  private saveSettings(): void {
    const settings: SoundSettings = {
      enabled: this.enabled,
      volume: this.volume,
      notificationSound: this.notificationSound,
      pomodoroSound: this.pomodoroSound,
    };
    localStorage.setItem("soundSettings", JSON.stringify(settings));
  }

  private initializeAudio(): void {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (error) {
      console.error("Failed to initialize Web Audio API:", error);
    }
  }

  private playBeep(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ): void {
    if (!this.audioContext) {
      console.warn("❌ AudioContext not initialized");
      return;
    }

    console.log(`🎶 Playing beep: ${frequency}Hz for ${duration}s`);

    try {
      if (this.audioContext.state === "suspended") {
        console.log("⏸️ AudioContext suspended, resuming...");
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.error("Failed to play beep:", error);
    }
  }

  playNotification(): void {
    console.log("🎵 SoundService.playNotification() called", {
      enabled: this.enabled,
      volume: this.volume,
      notificationSound: this.notificationSound,
      audioContextState: this.audioContext?.state,
    });

    if (!this.enabled) {
      console.log("❌ Sound disabled, skipping");
      return;
    }

    try {
      switch (this.notificationSound) {
        case "bell":
          // Single bell chime (higher pitch, longer)
          this.playBeep(1200, 0.4, "sine");
          break;
        case "chime":
          // Triple chime (descending)
          this.playBeep(880, 0.15, "sine");
          setTimeout(() => this.playBeep(784, 0.15, "sine"), 150);
          setTimeout(() => this.playBeep(659, 0.2, "sine"), 300);
          break;
        case "default":
        default:
          // Double beep (original)
          this.playBeep(800, 0.15, "sine");
          setTimeout(() => this.playBeep(1000, 0.15, "sine"), 150);
          break;
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }

  playPomodoro(): void {
    if (!this.enabled) return;

    try {
      switch (this.pomodoroSound) {
        case "alarm":
          // Urgent alarm (rapid beeps)
          for (let i = 0; i < 3; i++) {
            setTimeout(() => this.playBeep(1000, 0.1, "square"), i * 120);
          }
          break;
        case "gong":
          // Deep gong (low frequency)
          this.playBeep(200, 0.5, "sine");
          setTimeout(() => this.playBeep(150, 0.5, "sine"), 100);
          break;
        case "default":
        default:
          // C-E-G chord (original)
          this.playBeep(523, 0.2, "sine");
          setTimeout(() => this.playBeep(659, 0.2, "sine"), 200);
          setTimeout(() => this.playBeep(784, 0.3, "sine"), 400);
          break;
      }
    } catch (error) {
      console.error("Error playing pomodoro sound:", error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  setNotificationSound(sound: NotificationSoundType): void {
    this.notificationSound = sound;
    this.saveSettings();
  }

  setPomodoroSound(sound: PomodoroSoundType): void {
    this.pomodoroSound = sound;
    this.saveSettings();
  }

  getSettings(): SoundSettings {
    return {
      enabled: this.enabled,
      volume: this.volume,
      notificationSound: this.notificationSound,
      pomodoroSound: this.pomodoroSound,
    };
  }

  testNotification(): void {
    console.log("🧪 Testing notification sound...");
    this.ensureAudioContextRunning();
    this.playNotification();
  }

  testPomodoro(): void {
    console.log("🧪 Testing pomodoro sound...");
    this.ensureAudioContextRunning();
    this.playPomodoro();
  }

  /**
   * Force AudioContext to resume if suspended
   * Call this on user interaction (button click, etc.)
   */
  private ensureAudioContextRunning(): void {
    if (this.audioContext && this.audioContext.state === "suspended") {
      console.log("⏯️ Resuming suspended AudioContext...");
      this.audioContext.resume().then(() => {
        console.log("✅ AudioContext resumed successfully");
      });
    }
  }
}

export const soundService = new SoundService();
