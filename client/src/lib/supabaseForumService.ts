import { supabase } from './supabaseClient';
import type { ForumPost, ForumComment } from './supabaseClient';

/**
 * Forum Service for Supabase operations
 * Handles forum posts, comments, and reactions
 */

const checkSupabase = () => {
  if (!supabase) {
    console.warn('Supabase not configured, using mock data mode');
    return false;
  }
  return true;
};

export const forumService = {
  /**
   * Create a new forum post
   */
  async createPost(userId: string, title: string, content: any[]) {
    try {
      if (!checkSupabase()) return { success: false, post: null };

      const { data, error } = await supabase!
        .from('forum_posts')
        .insert([
          {
            user_id: userId,
            title,
            content,
            likes_count: 0,
            comments_count: 0,
            is_edited: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Create post error:', error);
        return { success: false, post: null };
      }

      return { success: true, post: data };
    } catch (error) {
      console.error('Create post error:', error);
      return { success: false, post: null };
    }
  },

  /**
   * Get all forum posts
   */
  async getPosts() {
    try {
      if (!checkSupabase()) return { success: false, posts: [] };

      const { data, error } = await supabase!
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get posts error:', error);
        return { success: false, posts: [] };
      }

      return { success: true, posts: data || [] };
    } catch (error) {
      console.error('Get posts error:', error);
      return { success: false, posts: [] };
    }
  },

  /**
   * Get a single forum post
   */
  async getPost(postId: string) {
    try {
      if (!checkSupabase()) return { success: false, post: null };

      const { data, error } = await supabase!
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Get post error:', error);
        return { success: false, post: null };
      }

      return { success: true, post: data };
    } catch (error) {
      console.error('Get post error:', error);
      return { success: false, post: null };
    }
  },

  /**
   * Update a forum post
   */
  async updatePost(postId: string, updates: Partial<ForumPost>) {
    try {
      if (!checkSupabase()) return { success: false, post: null };

      const { data, error } = await supabase!
        .from('forum_posts')
        .update({ ...updates, is_edited: true })
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        console.error('Update post error:', error);
        return { success: false, post: null };
      }

      return { success: true, post: data };
    } catch (error) {
      console.error('Update post error:', error);
      return { success: false, post: null };
    }
  },

  /**
   * Delete a forum post
   */
  async deletePost(postId: string) {
    try {
      if (!checkSupabase()) return { success: false };

      const { error } = await supabase!
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Delete post error:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete post error:', error);
      return { success: false };
    }
  },

  /**
   * Create a forum comment
   */
  async createComment(postId: string, userId: string, content: string) {
    try {
      if (!checkSupabase()) return { success: false, comment: null };

      const { data, error } = await supabase!
        .from('forum_comments')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            content,
            is_edited: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Create comment error:', error);
        return { success: false, comment: null };
      }

      return { success: true, comment: data };
    } catch (error) {
      console.error('Create comment error:', error);
      return { success: false, comment: null };
    }
  },

  /**
   * Get comments for a post
   */
  async getComments(postId: string) {
    try {
      if (!checkSupabase()) return { success: false, comments: [] };

      const { data, error } = await supabase!
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get comments error:', error);
        return { success: false, comments: [] };
      }

      return { success: true, comments: data || [] };
    } catch (error) {
      console.error('Get comments error:', error);
      return { success: false, comments: [] };
    }
  },

  /**
   * Update a forum comment
   */
  async updateComment(commentId: string, content: string) {
    try {
      if (!checkSupabase()) return { success: false, comment: null };

      const { data, error } = await supabase!
        .from('forum_comments')
        .update({ content, is_edited: true })
        .eq('id', commentId)
        .select()
        .single();

      if (error) {
        console.error('Update comment error:', error);
        return { success: false, comment: null };
      }

      return { success: true, comment: data };
    } catch (error) {
      console.error('Update comment error:', error);
      return { success: false, comment: null };
    }
  },

  /**
   * Delete a forum comment
   */
  async deleteComment(commentId: string) {
    try {
      if (!checkSupabase()) return { success: false };

      const { error } = await supabase!
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Delete comment error:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete comment error:', error);
      return { success: false };
    }
  }
};
