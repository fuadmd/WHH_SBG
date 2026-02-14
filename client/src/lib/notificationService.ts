import { supabase } from './supabaseClient';

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  post_id?: string;
  comment_id?: string;
  type: 'new_comment' | 'new_reply' | 'new_reaction' | 'mention';
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Notification Service
 * Handles notification creation, retrieval, and real-time updates
 */
export const notificationService = {
  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message?: string,
    postId?: string,
    commentId?: string,
    actorId?: string
  ): Promise<Notification | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return null;
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          actor_id: actorId,
          post_id: postId,
          comment_id: commentId,
          type,
          title,
          message,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Create notification error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  },

  /**
   * Get notifications for a user
   */
  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get notifications error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get unread notifications error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get unread notifications error:', error);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Mark as read error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark as read error:', error);
      return false;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Mark all as read error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark all as read error:', error);
      return false;
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Delete notification error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete notification error:', error);
      return false;
    }
  },

  /**
   * Subscribe to notifications for a user
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return subscription;
  },

  /**
   * Subscribe to notification updates (read/unread)
   */
  subscribeToNotificationUpdates(userId: string, callback: (notification: Notification) => void) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    const subscription = supabase
      .channel(`notifications:updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return subscription;
  },

  /**
   * Unsubscribe from notifications
   */
  unsubscribe(subscription: any) {
    if (subscription && supabase) {
      supabase.removeChannel(subscription);
    }
  },
};
