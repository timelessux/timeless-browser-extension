export interface Notification {
  address: string;
  profile_id?: string;
  actor_handle?: string;
  notification_type: string;
  publication_type?: string;
  publication_id?: string;
  id: string;
  created_at: string;
  title?: string;
  content: string;
}

export interface NotificationResponse {
  items: Array<Notification>;
  cursor?: string;
}
