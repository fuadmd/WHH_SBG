import { notificationService } from './notificationService';

/**
 * Forum Notification Helper
 * Handles notification creation for forum activities
 */

export const forumNotificationHelper = {
  /**
   * Notify post owner when a new comment is added
   */
  async notifyNewComment(
    postOwnerId: string,
    commentAuthorName: string,
    postTitle: string,
    postId: string,
    commentId: string,
    commentAuthorId: string
  ) {
    const title = `تعليق جديد على منشورك`;
    const message = `${commentAuthorName} أضاف تعليق على: "${postTitle}"`;

    await notificationService.createNotification(
      postOwnerId,
      'new_comment',
      title,
      message,
      postId,
      commentId,
      commentAuthorId
    );
  },

  /**
   * Notify comment author when a reply is added
   */
  async notifyNewReply(
    commentOwnerId: string,
    replyAuthorName: string,
    postTitle: string,
    postId: string,
    replyId: string,
    replyAuthorId: string
  ) {
    const title = `رد جديد على تعليقك`;
    const message = `${replyAuthorName} رد على تعليقك على: "${postTitle}"`;

    await notificationService.createNotification(
      commentOwnerId,
      'new_reply',
      title,
      message,
      postId,
      replyId,
      replyAuthorId
    );
  },

  /**
   * Notify post owner when a new reaction is added
   */
  async notifyNewReaction(
    postOwnerId: string,
    reactionAuthorName: string,
    reactionType: string,
    postTitle: string,
    postId: string,
    reactionAuthorId: string
  ) {
    const reactionEmoji: { [key: string]: string } = {
      like: '👍',
      love: '❤️',
      haha: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😠',
    };

    const emoji = reactionEmoji[reactionType] || '👍';
    const title = `تفاعل جديد على منشورك`;
    const message = `${reactionAuthorName} أعجب بـ ${emoji} منشورك: "${postTitle}"`;

    await notificationService.createNotification(
      postOwnerId,
      'new_reaction',
      title,
      message,
      postId,
      undefined,
      reactionAuthorId
    );
  },

  /**
   * Notify mentioned users
   */
  async notifyMention(
    mentionedUserId: string,
    mentionAuthorName: string,
    postTitle: string,
    postId: string,
    mentionAuthorId: string
  ) {
    const title = `تم الإشارة إليك`;
    const message = `${mentionAuthorName} أشار إليك في: "${postTitle}"`;

    await notificationService.createNotification(
      mentionedUserId,
      'mention',
      title,
      message,
      postId,
      undefined,
      mentionAuthorId
    );
  },

  /**
   * Notify multiple users (batch notification)
   */
  async notifyMultipleUsers(
    userIds: string[],
    type: 'new_comment' | 'new_reply' | 'new_reaction' | 'mention',
    title: string,
    message: string,
    postId: string,
    commentId?: string,
    actorId?: string
  ) {
    const promises = userIds.map((userId) =>
      notificationService.createNotification(
        userId,
        type,
        title,
        message,
        postId,
        commentId,
        actorId
      )
    );

    await Promise.all(promises);
  },
};
