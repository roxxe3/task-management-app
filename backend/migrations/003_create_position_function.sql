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