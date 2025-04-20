const { v4: uuidv4 } = require('uuid');
const { getSupabaseWithAuth } = require('../supabaseClient');

class TaskController {
  // Get all tasks with optional filtering
  async getTasks(req, res) {
    try {
      const { status, category_id, priority, search } = req.query;
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      let query = supabaseAuth
        .from("tasks")
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq("user_id", req.user.id);
      
      if (status === 'completed') {
        query = query.eq('completed', true);
      } else if (status === 'active') {
        query = query.eq('completed', false);
      }
      
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      
      if (priority) {
        query = query.eq('priority', priority);
      }
      
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase error fetching tasks:", error);
        return res.status(500).json({ 
          error: "Database error fetching tasks", 
          details: error.message,
          code: error.code 
        });
      }
      
      res.json(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  // Get a single task
  async getTask(req, res) {
    try {
      const { id } = req.params;
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      const { data, error } = await supabaseAuth
        .from("tasks")
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single();
      
      if (error) {
        console.error("Supabase error fetching task:", error);
        return res.status(500).json({ 
          error: "Database error fetching task", 
          details: error.message,
          code: error.code 
        });
      }
      
      if (!data) {
        return res.status(404).json({ error: "Task not found or you don't have permission to view it" });
      }
      
      res.json(data);
    } catch (err) {
      console.error("Unexpected error fetching task:", err);
      res.status(500).json({ error: "Failed to fetch task", details: err.message });
    }
  }

  // Create a new task
  async createTask(req, res) {
    try {
      const { 
        title, 
        description, 
        priority,
        completed,
        category_id,
        position
      } = req.body;
      
      const newTask = {
        id: uuidv4(),
        title,
        description: description || "",
        priority: priority || "medium",
        completed: completed || false,
        category_id: category_id || null,
        position: position || 0,
        user_id: req.user.id,
        created_at: new Date().toISOString()
      };
      
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      const { data, error } = await supabaseAuth
        .from("tasks")
        .insert([newTask])
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `);
      
      if (error) {
        console.error("Supabase error creating task:", error);
        return res.status(500).json({ 
          error: "Database error creating task", 
          details: error.message,
          code: error.code 
        });
      }
      
      if (!data || data.length === 0) {
        return res.status(500).json({ error: "No data returned from database after task creation" });
      }
      
      res.status(201).json(data[0]);
    } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ error: "Failed to create task" });
    }
  }

  // Update an existing task
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        priority,
        completed,
        category_id
      } = req.body;
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (priority !== undefined) updateData.priority = priority;
      if (completed !== undefined) updateData.completed = completed;
      if (category_id !== undefined) updateData.category_id = category_id;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }
      
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      const { data, error } = await supabaseAuth
        .from("tasks")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `);
      
      if (error) {
        console.error("Supabase error during task update:", error);
        return res.status(500).json({ 
          error: "Database error updating task", 
          details: error.message,
          code: error.code 
        });
      }
      
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Task not found or you don't have permission to update it" });
      }
      
      res.json(data[0]);
    } catch (err) {
      console.error("Unexpected error updating task:", err);
      res.status(500).json({ error: "Failed to update task", details: err.message });
    }
  }

  // Delete a task
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      const { error } = await supabaseAuth
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", req.user.id);
      
      if (error) {
        console.error("Supabase error deleting task:", error);
        return res.status(500).json({ 
          error: "Database error deleting task", 
          details: error.message,
          code: error.code 
        });
      }
      
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }

  // Update task position
  async updateTaskPosition(req, res) {
    try {
      const { id } = req.params;
      const { newPosition } = req.body;
      
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      // First get the current task to verify ownership
      const { data: currentTask, error: fetchError } = await supabaseAuth
        .from("tasks")
        .select("id")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching task:", fetchError);
        return res.status(500).json({ 
          error: "Database error fetching task", 
          details: fetchError.message 
        });
      }
      
      if (!currentTask) {
        return res.status(404).json({ error: "Task not found or you don't have permission to update it" });
      }
      
      // Update the task's position
      const { error: updateError } = await supabaseAuth
        .from("tasks")
        .update({ position: newPosition })
        .eq("id", id)
        .eq("user_id", req.user.id);
      
      if (updateError) {
        console.error("Error updating task position:", updateError);
        return res.status(500).json({ 
          error: "Failed to update task position", 
          details: updateError.message 
        });
      }
      
      res.json({ message: "Task position updated successfully" });
    } catch (err) {
      console.error("Unexpected error updating task position:", err);
      res.status(500).json({ error: "Failed to update task position", details: err.message });
    }
  }

  // Get unique categories
  async getUniqueCategories(req, res) {
    try {
      const authToken = req.headers.authorization?.split(" ")[1];
      const supabaseAuth = await getSupabaseWithAuth(authToken);
      
      const { data, error } = await supabaseAuth
        .from("tasks")
        .select("category_name, category_color, category_icon")
        .eq("user_id", req.user.id)
        .not("category_name", "is", null)
        .order("category_name");
      
      if (error) {
        console.error("Supabase error fetching categories:", error);
        return res.status(500).json({ 
          error: "Database error fetching categories", 
          details: error.message,
          code: error.code 
        });
      }
      
      // Return unique categories (removing duplicates)
      const uniqueCategories = Array.from(new Map(
        data.map(item => [item.category_name, item])
      ).values());
      
      // If no categories found, return default categories for new users
      if (uniqueCategories.length === 0) {
        console.log("No categories found, returning default categories for user");
        return res.json([
          {
            category_name: "Work",
            category_color: "#0284c7",
            category_icon: "fa-briefcase"
          },
          {
            category_name: "Personal",
            category_color: "#7e22ce",
            category_icon: "fa-user"
          },
          {
            category_name: "Shopping",
            category_color: "#16a34a",
            category_icon: "fa-shopping-cart"
          },
          {
            category_name: "Health",
            category_color: "#dc2626",
            category_icon: "fa-heart"
          },
          {
            category_name: "Education",
            category_color: "#ea580c",
            category_icon: "fa-book"
          }
        ]);
      }
      
      res.json(uniqueCategories);
    } catch (err) {
      console.error("Unexpected error fetching categories:", err);
      res.status(500).json({ error: "Failed to fetch categories", details: err.message });
    }
  }
}

module.exports = new TaskController(); 