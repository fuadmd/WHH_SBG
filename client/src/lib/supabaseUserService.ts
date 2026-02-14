import { supabase } from './supabaseClient';
import { User } from '../types';

/**
 * User Service for Supabase operations
 * Handles user authentication, profile management, and user data
 */

export const userService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'BENEFICIARY'
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to sign up' };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out' };
    }
  },

  /**
   * Get current user session
   */
  async getCurrentUser() {
    try {
      if (!supabase) {
        return { success: false, user: null };
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get current user error:', error);
        return { success: false, user: null };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, user: null };
    }
  },

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string) {
    try {
      if (!supabase) {
        return { success: false, profile: null };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user profile error:', error);
        return { success: false, profile: null };
      }

      return { success: true, profile: data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, profile: null };
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      if (!supabase) {
        return { success: false, profile: null };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update user profile error:', error);
        return { success: false, profile: null };
      }

      return { success: true, profile: data };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, profile: null };
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    try {
      if (!supabase) {
        return { success: false, users: [] };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Get all users error:', error);
        return { success: false, users: [] };
      }

      return { success: true, users: data || [] };
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, users: [] };
    }
  },

  /**
   * Ban user from forum
   */
  async banUserFromForum(userId: string, reason?: string) {
    try {
      if (!supabase) {
        return { success: false };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ban_from_forum: true,
          ban_reason: reason
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Ban user from forum error:', error);
        return { success: false };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Ban user from forum error:', error);
      return { success: false };
    }
  },

  /**
   * Ban user from market
   */
  async banUserFromMarket(userId: string, reason?: string) {
    try {
      if (!supabase) {
        return { success: false };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ban_from_market: true,
          ban_reason: reason
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Ban user from market error:', error);
        return { success: false };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Ban user from market error:', error);
      return { success: false };
    }
  },

  /**
   * Unban user from forum
   */
  async unbanUserFromForum(userId: string) {
    try {
      if (!supabase) {
        return { success: false };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ban_from_forum: false,
          ban_reason: null
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Unban user from forum error:', error);
        return { success: false };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Unban user from forum error:', error);
      return { success: false };
    }
  },

  /**
   * Unban user from market
   */
  async unbanUserFromMarket(userId: string) {
    try {
      if (!supabase) {
        return { success: false };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ban_from_market: false,
          ban_reason: null
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Unban user from market error:', error);
        return { success: false };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Unban user from market error:', error);
      return { success: false };
    }
  }
};
