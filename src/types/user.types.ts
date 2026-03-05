import type { Theme, DateFormat, TimeFormat } from "./common.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  theme: Theme;
  compactView: boolean;
  reducedMotion: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  ticketCreated: boolean;
  ticketUpdated: boolean;
  ticketResolved: boolean;
  newsletter: boolean;
  productUpdates: boolean;
}
