import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { notificationService, Notification } from '../lib/notificationService';
import { UI_STRINGS } from '../constants';

interface NotificationCenterProps {
  userId?: string;
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId, language, theme }) => {
  const t = UI_STRINGS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    if (!userId) return;
    loadNotifications();
  }, [userId]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    let subscription = notificationService.subscribeToNotifications(userId, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    let updateSubscription = notificationService.subscribeToNotificationUpdates(userId, (updatedNotification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
      );
      // Update unread count
      const oldNotif = notifications.find((n) => n.id === updatedNotification.id);
      if (oldNotif?.is_read === false && updatedNotification.is_read === true) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    return () => {
      notificationService.unsubscribe(subscription);
      notificationService.unsubscribe(updateSubscription);
    };
  }, [userId, notifications]);

  const loadNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const notifs = await notificationService.getNotifications(userId, 50);
      setNotifications(notifs);
      const unread = notifs.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Load notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    await notificationService.markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId);
    setNotifications((prev) => {
      const deleted = prev.find((n) => n.id === notificationId);
      if (deleted?.is_read === false) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_comment':
        return '💬';
      case 'new_reply':
        return '↩️';
      case 'new_reaction':
        return '👍';
      case 'mention':
        return '@';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_comment':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'new_reply':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'new_reaction':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'mention':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition ${
          theme === 'dark'
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        title={language === 'AR' ? 'الإشعارات' : 'Notifications'}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-96 rounded-lg shadow-2xl border z-50 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {language === 'AR' ? 'الإشعارات' : 'Notifications'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded transition ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'AR' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {language === 'AR' ? 'لا توجد إشعارات' : 'No notifications'}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b transition hover:opacity-80 ${
                    !notification.is_read
                      ? getNotificationColor(notification.type)
                      : theme === 'dark'
                      ? 'border-gray-700'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {notification.message && (
                        <p
                          className={`text-xs mt-1 line-clamp-2 ${
                            theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }`}
                        >
                          {notification.message}
                        </p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          theme === 'dark'
                            ? 'text-gray-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(notification.created_at).toLocaleDateString(
                          language === 'AR' ? 'ar-SA' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`p-1 rounded transition ${
                            theme === 'dark'
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title={language === 'AR' ? 'تحديد كمقروء' : 'Mark as read'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className={`p-1 rounded transition ${
                          theme === 'dark'
                            ? 'hover:bg-red-900/20 text-red-400'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                        title={language === 'AR' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={handleMarkAllAsRead}
                className="w-full py-2 px-3 rounded text-sm font-medium transition bg-blue-600 hover:bg-blue-700 text-white"
              >
                {language === 'AR' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
