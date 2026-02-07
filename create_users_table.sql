CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default users (Migrating from hardcoded)
INSERT INTO app_users (username, password, role, is_active) VALUES 
('admin', 'Asdzxc54321@', 'admin', true),
('Najah', 'najah2022', 'user', true),
('khatab', '099690', 'user', true),
('user', 'Mbkd@2026', 'user', true)
ON CONFLICT (username) DO NOTHING;
