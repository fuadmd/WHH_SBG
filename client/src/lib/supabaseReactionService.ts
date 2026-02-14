import { supabase } from './supabaseClient';
import type { PostReactionCount, Reaction } from './supabaseClient';

/**
 * Reaction Service for handling all reaction-related operations
 * Uses Supabase for data persistence with fallback to mock data
 */

const checkSupabase = () => {
  if (!supabase) {
    console.warn('Supabase not configured, using mock data mode');
    return false;
  }
  return true;
};

export const reactionService = {
  /**
   * Fetch reaction counts for a post from post_reaction_counts view
   */
  async getReactionCounts(postId: string): Promise<PostReactionCount[]> {
    try {
      if (!postId) {
        console.warn('postId is required');
        return [];
      }

      if (!checkSupabase()) return [];

      const { data, error } = await supabase!
        .from('post_reaction_counts')
        .select('*')
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching reaction counts:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching reaction counts:', error);
      return [];
    }
  },

  /**
   * Fetch all reactions for a post (for checking user's current reaction)
   */
  async getPostReactions(postId: string): Promise<Reaction[]> {
    try {
      if (!postId) {
        console.warn('postId is required');
        return [];
      }

      if (!checkSupabase()) return [];

      const { data, error } = await supabase!
        .from('reactions')
        .select('*')
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching post reactions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching post reactions:', error);
      return [];
    }
  },

  /**
   * Get user's reaction for a specific post
   */
  async getUserReaction(postId: string, userId: string): Promise<Reaction | null> {
    try {
      if (!postId || !userId) {
        console.warn('postId and userId are required');
        return null;
      }

      if (!checkSupabase()) return null;

      const { data, error } = await supabase!
        .from('reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user reaction:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching user reaction:', error);
      return null;
    }
  },

  /**
   * Add or update a reaction
   */
  async addReaction(postId: string, userId: string, reactionType: string): Promise<Reaction | null> {
    try {
      if (!postId || !userId || !reactionType) {
        console.warn('postId, userId, and reactionType are required');
        return null;
      }

      if (!checkSupabase()) return null;

      const { data, error } = await supabase!
        .from('reactions')
        .upsert({
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding reaction:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return null;
    }
  },

  /**
   * Remove a reaction
   */
  async removeReaction(postId: string, userId: string): Promise<boolean> {
    try {
      if (!postId || !userId) {
        console.warn('postId and userId are required');
        return false;
      }

      if (!checkSupabase()) return false;

      const { error } = await supabase!
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing reaction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      return false;
    }
  }
};
