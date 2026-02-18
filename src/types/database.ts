import type { Reading, Reflection, PPFReading } from './tarot';
import type { UserProfile, Subscription } from './user';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<UserProfile, 'id' | 'createdAt'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id'>;
        Update: Partial<Omit<Subscription, 'id' | 'userId'>>;
      };
      readings: {
        Row: Reading;
        Insert: Omit<Reading, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Reading, 'id' | 'userId' | 'createdAt'>>;
      };
      reflections: {
        Row: Reflection;
        Insert: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Reflection, 'id' | 'userId' | 'readingId' | 'createdAt'>>;
      };
      ppf_readings: {
        Row: PPFReading;
        Insert: Omit<PPFReading, 'id' | 'createdAt'>;
        Update: Partial<Omit<PPFReading, 'id' | 'userId' | 'createdAt'>>;
      };
    };
  };
}
