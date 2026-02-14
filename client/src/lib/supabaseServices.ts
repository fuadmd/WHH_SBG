import { supabase } from './supabaseClient';

/**
 * Supabase Services - All database operations
 * Includes fallback checks for when Supabase is not configured
 */

// Helper function to check if supabase is available
const checkSupabase = () => {
  if (!supabase) {
    console.warn('Supabase not configured, using mock data mode');
    return false;
  }
  return true;
};

// ============================================
// ADMIN SERVICES
// ============================================

export const adminService = {
  // Get logs
  async getLogs(limit: number = 100) {
    if (!checkSupabase()) return [];
    
    const { data, error } = await supabase!
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// ============================================
// SITE SETTINGS SERVICES
// ============================================

export const siteSettingsService = {
  // Get setting
  async get(key: string) {
    if (!checkSupabase()) return null;
    
    const { data, error } = await supabase!
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.setting_value || null;
  },

  // Set setting
  async set(key: string, value: string) {
    if (!checkSupabase()) return null;
    
    const { data, error } = await supabase!
      .from('site_settings')
      .upsert({ setting_key: key, setting_value: value })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all settings
  async getAll() {
    if (!checkSupabase()) return [];
    
    const { data, error } = await supabase!
      .from('site_settings')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};
