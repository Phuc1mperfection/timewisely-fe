export interface NotificationSettings {
  enabled: boolean;
  sound: {
    enabled: boolean;
    volume: number; // 0-100
  };
  browser: {
    enabled: boolean;
  };
  email: {
    enabled: boolean;
    address?: string; // User email (optional - lấy từ user profile)
  };
  reminders: {
    taskReminder: boolean;
    activityReminder: boolean;
    overdueAlert: boolean;
    morningDigest: boolean;
  };
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  sound: {
    enabled: true,
    volume: 50,
  },
  browser: {
    enabled: true,
  },
  email: {
    enabled: false, // Default off (cần user enable)
  },
  reminders: {
    taskReminder: true,
    activityReminder: true,
    overdueAlert: true,
    morningDigest: true,
  },
};

const STORAGE_KEY = "notificationSettings";

export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    // Merge với default để đảm bảo có đủ fields
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      sound: { ...DEFAULT_SETTINGS.sound, ...parsed.sound },
      browser: { ...DEFAULT_SETTINGS.browser, ...parsed.browser },
      email: { ...DEFAULT_SETTINGS.email, ...parsed.email },
      reminders: { ...DEFAULT_SETTINGS.reminders, ...parsed.reminders },
    };
  } catch (error) {
    console.error("Failed to load notification settings:", error);
    return DEFAULT_SETTINGS;
  }
};


export const saveNotificationSettings = (
  settings: NotificationSettings
): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save notification settings:", error);
  }
};


export const resetNotificationSettings = (): NotificationSettings => {
  saveNotificationSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};


export const isNotificationTypeEnabled = (
  type: "taskReminder" | "activityReminder" | "overdueAlert" | "morningDigest"
): boolean => {
  const settings = loadNotificationSettings();
  return settings.enabled && settings.reminders[type];
};


export const isSoundEnabled = (): boolean => {
  const settings = loadNotificationSettings();
  return settings.enabled && settings.sound.enabled;
};


export const getVolume = (): number => {
  const settings = loadNotificationSettings();
  return settings.sound.volume / 100; // Convert 0-100 → 0-1
};
