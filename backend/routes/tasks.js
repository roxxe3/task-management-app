const express = require("express");
const router = express.Router();
const { supabase, getSupabaseWithAuth } = require("../supabaseClient");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid');

// Use auth middleware for all task routes
router.use(authMiddleware);

// GET /tasks - Fetch all tasks with optional filtering
router.get("/", async (req, res) => {
  try {
    const { status, category_id, priority, search } = req.query;
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    // Start building the query
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
    
    // Add filters if provided
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
    
    // Order by created date
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
    
    // Return empty array if no data
    if (!data) {
      return res.json([]);
    }
    
    res.json(data);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /tasks/:id - Get a single task
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get authenticated Supabase client with user token
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
    
    // Check if task exists
    if (!data) {
      return res.status(404).json({ error: "Task not found or you don't have permission to view it" });
    }
    
    res.json(data);
  } catch (err) {
    console.error("Unexpected error fetching task:", err);
    res.status(500).json({ error: "Failed to fetch task", details: err.message });
  }
});

// POST /tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      priority,
      completed,
      category_id,
      position
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    // Create the task
    const newTask = {
      id: uuidv4(),
      title,
      description: description || "",
      priority: priority || "medium",
      completed: completed || false,
      category_id: category_id || null,
      position: position || 0, // Default to 0 if not provided
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };
    
    // Get authenticated Supabase client with user token
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
});

// PUT /tasks/:id - Update an existing task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      priority,
      completed,
      category_id
    } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (completed !== undefined) updateData.completed = completed;
    if (category_id !== undefined) updateData.category_id = category_id;
    
    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    // Get authenticated Supabase client with user token
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
    
    // Check if task exists
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Task not found or you don't have permission to update it" });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error("Unexpected error updating task:", err);
    res.status(500).json({ error: "Failed to update task", details: err.message });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();
    
    if (error) {
      console.error("Supabase error during task deletion:", error);
      return res.status(500).json({ 
        error: "Database error deleting task", 
        details: error.message,
        code: error.code 
      });
    }
    
    // Check if task was found and deleted
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Task not found or you don't have permission to delete it" });
    }
    
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Unexpected error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task", details: err.message });
  }
});

// GET /tasks/categories - Get all unique categories used in tasks
router.get("/categories/unique", async (req, res) => {
  try {
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    // Get distinct category information from tasks table
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
});

// PUT /tasks/:id/position - Update task position
router.put("/:id/position", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPosition } = req.body;
    
    if (typeof newPosition !== 'number') {
      return res.status(400).json({ error: "newPosition must be a number" });
    }
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    // First get the current task to verify ownership and get current position
    const { data: currentTask, error: fetchError } = await supabaseAuth
      .from("tasks")
      .select("position")
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
    
    // Begin transaction to update positions
    const { data, error } = await supabaseAuth.rpc('update_task_positions', {
      p_task_id: id,
      p_new_position: newPosition,
      p_user_id: req.user.id
    });
    
    if (error) {
      console.error("Error updating task positions:", error);
      return res.status(500).json({ 
        error: "Failed to update task positions", 
        details: error.message 
      });
    }
    
    res.json({ message: "Task position updated successfully" });
  } catch (err) {
    console.error("Unexpected error updating task position:", err);
    res.status(500).json({ error: "Failed to update task position", details: err.message });
  }
});

module.exports = router;
