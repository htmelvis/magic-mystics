export type AnnouncementType = 'info' | 'cta' | 'feature';
export type AnnouncementTier = 'all' | 'free' | 'premium';

export interface Announcement {
  id: string;
  title: string;
  message: string | null;
  type: AnnouncementType;
  action_label: string | null;
  action_route: string | null;
  target_tier: AnnouncementTier;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string;
}

export interface ToastConfig {
  id: string;
  type: AnnouncementType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismissMs?: number;
}
