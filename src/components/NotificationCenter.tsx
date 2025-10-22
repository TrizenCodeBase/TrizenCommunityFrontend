import { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { notificationService, Notification, NotificationPreferences } from '@/services/notifications';

interface NotificationCenterProps {
    onPreferencesChange?: (preferences: NotificationPreferences) => void;
}

const NotificationCenter = ({ onPreferencesChange }: NotificationCenterProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [preferences, setPreferences] = useState<NotificationPreferences>(notificationService.getPreferences());
    const [isOpen, setIsOpen] = useState(false);

    // Load notifications and preferences
    useEffect(() => {
        const loadData = () => {
            setNotifications(notificationService.getInAppNotifications());
            setPreferences(notificationService.getPreferences());
        };

        loadData();

        // Refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notificationService.getUnreadCount();

    const handleMarkAsRead = (notificationId: string) => {
        notificationService.markAsRead(notificationId);
        setNotifications(notificationService.getInAppNotifications());
    };

    const handleMarkAllAsRead = () => {
        notificationService.markAllAsRead();
        setNotifications(notificationService.getInAppNotifications());
    };

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | string) => {
        const newPreferences = { ...preferences, [key]: value };
        notificationService.savePreferences(newPreferences);
        setPreferences(newPreferences);
        onPreferencesChange?.(newPreferences);
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                        <CheckCheck className="w-3 h-3 mr-1" />
                                        Mark all read
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.slice(0, 10).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => {
                                            if (!notification.read) {
                                                handleMarkAsRead(notification.id);
                                            }
                                            if (notification.actionUrl) {
                                                window.location.href = notification.actionUrl;
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification.id);
                                                    }}
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Notification Preferences */}
                        <div className="border-t border-gray-100 p-3">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-900">Preferences</h4>
                                <Settings className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-gray-600">In-app notifications</label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.inAppNotifications}
                                        onChange={(e) => handlePreferenceChange('inAppNotifications', e.target.checked)}
                                        className="w-3 h-3"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-gray-600">Push notifications</label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.pushNotifications}
                                        onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                                        className="w-3 h-3"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-gray-600">Email digest</label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailDigest}
                                        onChange={(e) => handlePreferenceChange('emailDigest', e.target.checked)}
                                        className="w-3 h-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationCenter;
