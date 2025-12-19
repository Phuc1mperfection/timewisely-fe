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
  private enabled: boolean = true;
  private volume: number = 0.5; // 0-1
  private notificationSound: NotificationSoundType = "default";
  private pomodoroSound: PomodoroSoundType = "default";

  constructor() {
    this.loadSettings();
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

  private fallbackBeep(
    frequency: number = 3000,
    duration: number = 0.3,
    type: OscillatorType = "sine"
  ): void {
    // Simple beep using AudioContext as fallback
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error("Fallback beep failed:", error);
    }
  }

  private playAudioFile(audioSrc: string): void {
    console.log("🔊 Trying to load audio file:", audioSrc);
    try {
      const audio = new Audio(audioSrc);
      audio.volume = this.volume;
      audio.currentTime = 0; // Reset về đầu

      audio.play().catch((error) => {
        console.warn("🎵 Audio play failed:", audioSrc, error.message);
        // Try alternative extension
        const altSrc = audioSrc.replace(".mp3", ".wav").replace(".wav", ".mp3");
        if (altSrc !== audioSrc) {
          console.log("🔄 Trying alternative extension:", altSrc);
          this.tryPlayAudio(altSrc);
        } else {
          console.warn("🔊 No alternative extension, using beep fallback");
          this.fallbackBeep();
        }
      });
    } catch (error) {
      console.error("🎵 Audio creation failed:", error);
      this.fallbackBeep(); // Fallback
    }
  }

  private tryPlayAudio(audioSrc: string): void {
    try {
      const audio = new Audio(audioSrc);
      audio.volume = this.volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        console.warn(
          "Alternative audio file not found, using beep fallback:",
          audioSrc
        );
        this.fallbackBeep();
      });
    } catch (error) {
      console.error("Alternative audio creation failed:", error);
      this.fallbackBeep();
    }
  }

  playNotification(): void {
    console.log("🎵 SoundService.playNotification() called", {
      enabled: this.enabled,
      volume: this.volume,
      notificationSound: this.notificationSound,
    });

    if (!this.enabled) {
      console.log("❌ Sound disabled, skipping");
      return;
    }

    // Play different notification sounds based on type
    switch (this.notificationSound) {
      case "bell":
        this.playBellSound();
        break;
      case "chime":
        this.playChimeSound();
        break;
      case "default":
      default:
        this.playDefaultNotificationSound();
        break;
    }
  }

  playPomodoro(): void {
    if (!this.enabled) return;

    // Play different pomodoro sounds based on type
    switch (this.pomodoroSound) {
      case "alarm":
        this.playAlarmSound();
        break;
      case "gong":
        this.playGongSound();
        break;
      case "default":
      default:
        this.playDefaultPomodoroSound();
        break;
    }
  }

  private playBellSound(): void {
    this.playAudioFile("/sounds/notification-bell.mp3");
  }

  private playChimeSound(): void {
    this.playAudioFile("/sounds/notification-chime.mp3");
  }

  private playDefaultNotificationSound(): void {
    this.playAudioFile("/sounds/notification-default.mp3");
  }

  private playAlarmSound(): void {
    this.playAudioFile("/sounds/pomodoro-alarm.mp3");
  }

  private playGongSound(): void {
    this.playAudioFile("/sounds/pomodoro-gong.mp3");
  }

  private playDefaultPomodoroSound(): void {
    this.playAudioFile("/sounds/pomodoro-default.mp3");
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
    this.playNotification();
  }

  testPomodoro(): void {
    console.log("🧪 Testing pomodoro sound...");
    this.playPomodoro();
  }
}

export const soundService = new SoundService();
