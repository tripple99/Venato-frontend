export enum NotificationType {
  SYSTEM = "SYSTEM",
  ALERT = "ALERT",
  PROMO = "PROMO",
  MARKET = "MARKET",
  PRICE_CHANGE = "PRICE_CHANGE"
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ"
}

export interface INotification {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
