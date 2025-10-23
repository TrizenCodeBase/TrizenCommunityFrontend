// Notification service for smart notifications
export interface NotificationPreferences {
    emailDigest: boolean;
    weeklySummary: boolean;
    inAppNotifications: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    customTiming: 'morning' | 'afternoon' | 'evening';
}

export interface Notification {
    id: string;
    type: 'event_reminder' | 'new_event' | 'event_update' | 'weekly_digest' | 'daily_digest';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

class NotificationService {
    private preferences: NotificationPreferences = {
        emailDigest: true,
        weeklySummary: true,
        inAppNotifications: true,
        pushNotifications: false,
        smsAlerts: false,
        customTiming: 'morning'
    };

    // Load preferences from localStorage
    loadPreferences(): NotificationPreferences {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        }
        return this.preferences;
    }

    // Save preferences to localStorage
    savePreferences(preferences: Partial<NotificationPreferences>): void {
        this.preferences = { ...this.preferences, ...preferences };
        localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    }

    // Get current preferences
    getPreferences(): NotificationPreferences {
        return this.preferences;
    }

    // Request notification permission
    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Send browser notification
    async sendBrowserNotification(title: string, options?: NotificationOptions): Promise<void> {
        if (!this.preferences.pushNotifications) {
            return;
        }

        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
            return;
        }

        new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });
    }

    // Send in-app notification
    sendInAppNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
        if (!this.preferences.inAppNotifications) {
            return;
        }

        const newNotification: Notification = {
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
            ...notification
        };

        // Store in localStorage
        const notifications = this.getInAppNotifications();
        notifications.unshift(newNotification);

        // Keep only last 50 notifications
        if (notifications.length > 50) {
            notifications.splice(50);
        }

        localStorage.setItem('inAppNotifications', JSON.stringify(notifications));
    }

    // Get in-app notifications
    getInAppNotifications(): Notification[] {
        const saved = localStorage.getItem('inAppNotifications');
        return saved ? JSON.parse(saved) : [];
    }

    // Mark notification as read
    markAsRead(notificationId: string): void {
        const notifications = this.getInAppNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('inAppNotifications', JSON.stringify(notifications));
        }
    }

    // Mark all notifications as read
    markAllAsRead(): void {
        const notifications = this.getInAppNotifications();
        notifications.forEach(n => n.read = true);
        localStorage.setItem('inAppNotifications', JSON.stringify(notifications));
    }

    // Get unread count
    getUnreadCount(): number {
        const notifications = this.getInAppNotifications();
        return notifications.filter(n => !n.read).length;
    }

    // Schedule event reminder
    scheduleEventReminder(eventTitle: string, eventDate: Date, reminderMinutes: number = 15): void {
        const reminderTime = new Date(eventDate.getTime() - (reminderMinutes * 60 * 1000));
        const now = new Date();

        if (reminderTime > now) {
            const timeout = reminderTime.getTime() - now.getTime();

            setTimeout(() => {
                this.sendBrowserNotification(
                    `Event Reminder: ${eventTitle}`,
                    {
                        body: `Your event "${eventTitle}" starts in ${reminderMinutes} minutes!`,
                        tag: `event-reminder-${eventTitle}`,
                        requireInteraction: true
                    }
                );

                this.sendInAppNotification({
                    type: 'event_reminder',
                    title: 'Event Reminder',
                    message: `Your event "${eventTitle}" starts in ${reminderMinutes} minutes!`,
                    actionUrl: '/events'
                });
            }, timeout);
        }
    }

    // Send daily digest
    sendDailyDigest(events: any[]): void {
        if (!this.preferences.emailDigest) {
            return;
        }

        const todayEvents = events.filter(event => {
            const eventDate = new Date(event.startDate);
            const today = new Date();
            return eventDate.toDateString() === today.toDateString();
        });

        if (todayEvents.length > 0) {
            this.sendInAppNotification({
                type: 'daily_digest',
                title: 'Daily Event Digest',
                message: `You have ${todayEvents.length} events today!`,
                actionUrl: '/events'
            });
        }
    }

    // Send weekly summary
    sendWeeklySummary(events: any[]): void {
        if (!this.preferences.weeklySummary) {
            return;
        }

        const weekEvents = events.filter(event => {
            const eventDate = new Date(event.startDate);
            const now = new Date();
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            return eventDate >= weekStart && eventDate < weekEnd;
        });

        this.sendInAppNotification({
            type: 'weekly_digest',
            title: 'Weekly Event Summary',
            message: `You have ${weekEvents.length} events this week!`,
            actionUrl: '/events'
        });
    }

    // Clear all notifications
    clearAllNotifications(): void {
        localStorage.removeItem('inAppNotifications');
    }
}

export const notificationService = new NotificationService();


