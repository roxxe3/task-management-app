-- Comprehensive database setup file for the Task Management app
-- This file combines migrations for initial project setup

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#2d2d2d',
  icon TEXT DEFAULT 'fa-folder',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  category_id UUID REFERENCES categories(id),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  position INTEGER DEFAULT 0
);

-- Add position column if not exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Insert the 4 default categories
INSERT INTO categories (name, color, icon)
VALUES 
  ('Work', '#0284c7', 'fa-briefcase'),
  ('Personal', '#7e22ce', 'fa-user'),
  ('Shopping', '#16a34a', 'fa-shopping-cart'),
  ('Health', '#dc2626', 'fa-heart')
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color,
    icon = EXCLUDED.icon;

-- Create function to update task positions
CREATE OR REPLACE FUNCTION update_task_positions(
  p_task_id UUID,
  p_new_position INTEGER,
  p_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_old_position INTEGER;
  v_max_position INTEGER;
BEGIN
  -- Get the current position of the task
  SELECT position INTO v_old_position
  FROM tasks
  WHERE id = p_task_id AND user_id = p_user_id;
  
  -- Get the maximum position
  SELECT COALESCE(MAX(position), 0) INTO v_max_position
  FROM tasks
  WHERE user_id = p_user_id;
  
  -- Ensure new position is within bounds
  IF p_new_position < 0 THEN
    p_new_position := 0;
  ELSIF p_new_position > v_max_position THEN
    p_new_position := v_max_position;
  END IF;
  
  -- Update positions of other tasks
  IF v_old_position < p_new_position THEN
    -- Moving task down: shift tasks in between old and new positions up
    UPDATE tasks
    SET position = position - 1
    WHERE user_id = p_user_id
      AND position > v_old_position
      AND position <= p_new_position;
  ELSIF v_old_position > p_new_position THEN
    -- Moving task up: shift tasks in between new and old positions down
    UPDATE tasks
    SET position = position + 1
    WHERE user_id = p_user_id
      AND position >= p_new_position
      AND position < v_old_position;
  END IF;
  
  -- Update the position of the target task
  UPDATE tasks
  SET position = p_new_position
  WHERE id = p_task_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Set up proper task positions for existing tasks if needed
WITH numbered_tasks AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 as new_position
  FROM tasks
  WHERE position = 0
)
UPDATE tasks t
SET position = nt.new_position
FROM numbered_tasks nt
WHERE t.id = nt.id;