-- ============================================
-- SBG Project Hub - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- user, seller, admin, super_admin
  admin_permission VARCHAR(50), -- MANAGER, SUPER_ADMIN
  ban_from_forum BOOLEAN DEFAULT FALSE,
  ban_from_market BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. PROJECTS/STORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  logo_url TEXT,
  cover_url TEXT,
  website_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  stock_status VARCHAR(50) DEFAULT 'in_stock',
  quantity INTEGER,
  is_published BOOLEAN DEFAULT TRUE,
  specifications JSONB,
  gallery_urls TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. FORUM POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. FORUM COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. REACTIONS TABLE (One reaction per user per post)
-- ============================================
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- ============================================
-- 7. MEDIA/ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_name VARCHAR(255),
  file_size INTEGER,
  youtube_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. ADMIN LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100),
  target_id UUID,
  target_type VARCHAR(50),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. HERO SLIDER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slider (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);
CREATE INDEX IF NOT EXISTS idx_products_project_id ON products(project_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_user ON reactions(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_media_post_id ON media(post_id);
CREATE INDEX IF NOT EXISTS idx_media_comment_id ON media(comment_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================
-- Everyone can read all users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- PROJECTS POLICIES
-- ============================================
-- Everyone can read all projects
CREATE POLICY "Projects are readable by all" ON projects FOR SELECT USING (true);
-- Owners can update their own projects
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
-- Owners can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Owners can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PRODUCTS POLICIES
-- ============================================
-- Everyone can read all products
CREATE POLICY "Products are readable by all" ON products FOR SELECT USING (true);

-- ============================================
-- FORUM POSTS POLICIES
-- ============================================
-- Everyone can read all forum posts
CREATE POLICY "Forum posts are readable by all" ON forum_posts FOR SELECT USING (true);
-- Users can insert their own posts
CREATE POLICY "Users can insert own posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);
-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FORUM COMMENTS POLICIES
-- ============================================
-- Everyone can read all comments
CREATE POLICY "Comments are readable by all" ON forum_comments FOR SELECT USING (true);
-- Users can insert their own comments
CREATE POLICY "Users can insert own comments" ON forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON forum_comments FOR UPDATE USING (auth.uid() = user_id);
-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON forum_comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- REACTIONS POLICIES
-- ============================================
-- Everyone can read all reactions (IMPORTANT: For showing reaction counts to all users)
CREATE POLICY "Reactions are readable by all" ON reactions FOR SELECT USING (true);
-- Users can insert their own reactions
CREATE POLICY "Users can insert own reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own reactions
CREATE POLICY "Users can update own reactions" ON reactions FOR UPDATE USING (auth.uid() = user_id);
-- Users can delete their own reactions
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- MEDIA POLICIES
-- ============================================
-- Everyone can read all media
CREATE POLICY "Media is readable by all" ON media FOR SELECT USING (true);

-- ============================================
-- ADMIN LOGS POLICIES
-- ============================================
-- Only admins can read logs
CREATE POLICY "Only admins can read logs" ON admin_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- HERO SLIDER POLICIES
-- ============================================
-- Everyone can read slider
CREATE POLICY "Slider is readable by all" ON hero_slider FOR SELECT USING (true);
-- Only admins can manage slider
CREATE POLICY "Only admins can manage slider" ON hero_slider FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Only admins can update slider" ON hero_slider FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- SITE SETTINGS POLICIES
-- ============================================
-- Everyone can read settings
CREATE POLICY "Settings are readable by all" ON site_settings FOR SELECT USING (true);
-- Only admins can manage settings
CREATE POLICY "Only admins can manage settings" ON site_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Only admins can update settings" ON site_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample users
INSERT INTO users (id, email, name, role, admin_permission) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@sbg.com', 'Admin User', 'super_admin', 'SUPER_ADMIN'),
('550e8400-e29b-41d4-a716-446655440001', 'seller@sbg.com', 'Seller User', 'seller', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'user@sbg.com', 'Regular User', 'user', NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert sample site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_title', 'SBG Hub'),
('site_subtitle', 'Building a Resilient Digital Ecosystem'),
('primary_color', '#3B82F6'),
('font_family', 'Inter'),
('footer_text', '© 2026 SBG Hub. All rights reserved.')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================
