-- ============================================
-- Portfolio Database Schema for Supabase
-- Jalankan di SQL Editor Supabase
-- ============================================

-- 1. Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date TEXT,
    thumbnail TEXT,
    images TEXT[], -- array of image URLs
    tags TEXT[], -- array of tags
    github TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT,
    credential_id TEXT,
    date TEXT,
    category TEXT,
    tags TEXT[],
    verify_url TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    description TEXT,
    date TEXT,
    type TEXT, -- work, education, volunteer
    images TEXT[],
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    category TEXT, -- frontend, backend, tools, design
    lucide_icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Messages table (contact form)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Users table (for admin auth)
-- Supabase sudah punya auth.users, kita buat profile table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies: Public read, authenticated write
-- ============================================

-- Projects: Anyone can read, authenticated can manage
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Certificates: Anyone can read, authenticated can manage
CREATE POLICY "Public can view certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert certificates" ON certificates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update certificates" ON certificates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete certificates" ON certificates FOR DELETE USING (auth.role() = 'authenticated');

-- Experiences: Anyone can read, authenticated can manage
CREATE POLICY "Public can view experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert experiences" ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update experiences" ON experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete experiences" ON experiences FOR DELETE USING (auth.role() = 'authenticated');

-- Skills: Anyone can read, authenticated can manage
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

-- Messages: Anyone can insert, authenticated can read/manage
CREATE POLICY "Anyone can send messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can view messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: Users can view/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- Function: Auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Insert default admin user (optional)
-- ============================================
-- Kamu bisa signup dari Supabase Dashboard → Authentication → Add user
-- Atau pakai admin panel yang sudah ada
