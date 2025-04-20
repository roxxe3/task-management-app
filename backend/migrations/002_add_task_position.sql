-- Add position column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Create index for position column for better performance when reordering
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);

-- Update existing tasks to have sequential positions if they don't have one
WITH numbered_tasks AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 as new_position
  FROM tasks
  WHERE position = 0
)
UPDATE tasks t
SET position = nt.new_position
FROM numbered_tasks nt
WHERE t.id = nt.id; 