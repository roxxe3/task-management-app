-- First create the new categories table
CREATE TABLE IF NOT EXISTS categories_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#2d2d2d',
  icon TEXT DEFAULT 'fa-folder',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copy existing categories from tasks to the new categories table
INSERT INTO categories_new (name, color, icon)
SELECT DISTINCT category_name, category_color, category_icon
FROM tasks
WHERE category_name IS NOT NULL
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color,
    icon = EXCLUDED.icon;

-- Insert default categories
INSERT INTO categories_new (name, color, icon)
VALUES 
  ('Work', '#0284c7', 'fa-briefcase'),
  ('Personal', '#7e22ce', 'fa-user'),
  ('Shopping', '#16a34a', 'fa-shopping-cart'),
  ('Health', '#dc2626', 'fa-heart'),
  ('Education', '#ea580c', 'fa-book')
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color,
    icon = EXCLUDED.icon;

-- Add category_id column to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories_new(id);

-- Update tasks with category_id based on category_name
UPDATE tasks t
SET category_id = c.id
FROM categories_new c
WHERE t.category_name = c.name;

-- Drop old category columns
ALTER TABLE tasks DROP COLUMN IF EXISTS category_name;
ALTER TABLE tasks DROP COLUMN IF EXISTS category_color;
ALTER TABLE tasks DROP COLUMN IF EXISTS category_icon;

-- Drop old categories table if it exists
DROP TABLE IF EXISTS categories;

-- Rename new categories table
ALTER TABLE categories_new RENAME TO categories;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name); 