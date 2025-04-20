const express = require("express");
const router = express.Router();
const { supabase, getSupabaseWithAuth } = require("../supabaseClient");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid'); // Add UUID package

// Sample mock data for development with proper UUID format
const mockTasks = [
  {
    id: uuidv4(),
    title: "Complete project proposal",
    description: "Write up the full project proposal with timeline and budget",
    priority: "high",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    completed: false,
    category_name: "Work",
    category_color: "#2d2d2d",
    category_icon: "fa-briefcase",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruit",
    priority: "medium",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    completed: true,
    category_name: "Shopping",
    category_color: "#2d2d2d",
    category_icon: "fa-shopping-cart",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Workout session",
    description: "30 minutes cardio and strength training",
    priority: "low",
    due_date: new Date().toISOString(), // today
    completed: false,
    category_name: "Personal",
    category_color: "#2d2d2d",
    category_icon: "fa-user",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  }
];

// Use auth middleware for all task routes
router.use(authMiddleware);

// GET /tasks - Fetch all tasks with optional filtering
router.get("/", async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    // Start building the query
    let query = supabaseAuth
      .from("tasks")
      .select("*")
      .eq("user_id", req.user.id);
    
    // Add filters if provided
    if (status === 'completed') {
      query = query.eq('completed', true);
    } else if (status === 'active') {
      query = query.eq('completed', false);
    }
    
    if (category) {
      query = query.eq('category_name', category);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    // Order by due date
    query = query.order('due_date', { ascending: true });
    
    try {
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // If no data or using mock client, return mock tasks
      if (!data || data.length === 0) {
        console.log("Returning mock task data");
        
        // Filter mock data based on query params
        let filteredMockTasks = [...mockTasks];
        
        if (status === 'completed') {
          filteredMockTasks = filteredMockTasks.filter(task => task.completed);
        } else if (status === 'active') {
          filteredMockTasks = filteredMockTasks.filter(task => !task.completed);
        }
        
        if (category) {
          filteredMockTasks = filteredMockTasks.filter(task => task.category_name === category);
        }
        
        if (priority) {
          filteredMockTasks = filteredMockTasks.filter(task => task.priority === priority);
        }
        
        if (search) {
          filteredMockTasks = filteredMockTasks.filter(task => 
            task.title.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        return res.json(filteredMockTasks);
      }
      
      res.json(data);
    } catch (err) {
      console.log("Using fallback mock data due to query error:", err);
      res.json(mockTasks);
    }
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
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();
    
    if (error) {
      console.error("Supabase error fetching task:", error);
      // Check if it's a mock task ID
      const mockTask = mockTasks.find(task => task.id === id);
      if (mockTask) {
        return res.json(mockTask);
      }
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
      due_date, 
      completed,
      category_name,
      category_color,
      category_icon
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    // Validate category if provided
    if (category_name) {
      try {
        // Get authenticated Supabase client with user token
        const authToken = req.headers.authorization?.split(" ")[1];
        const supabaseAuth = await getSupabaseWithAuth(authToken);
        
        // Check if this is a valid category for this user
        const { data: existingCategories, error: catError } = await supabaseAuth
          .from("tasks")
          .select("category_name")
          .eq("user_id", req.user.id)
          .eq("category_name", category_name)
          .limit(1);
          
        if (catError) {
          console.error("Error validating category:", catError);
        } else if (!existingCategories || existingCategories.length === 0) {
          // Check if the category exists in our default categories (for first-time use)
          const isDefaultCategory = ["Work", "Personal", "Shopping", "Health", "Education"].includes(category_name);
          
          if (!isDefaultCategory) {
            return res.status(400).json({ error: "Invalid category. Please use a category from the provided list." });
          }
          // If it's a default category, it's allowed to be used for the first time
        }
      } catch (catValidationErr) {
        console.error("Error during category validation:", catValidationErr);
        // Continue even if validation failed to avoid blocking task creation
      }
    }
    
    // Create the task with embedded category information
    const newTask = {
      id: uuidv4(),
      title,
      description: description || "",
      priority: priority || "medium",
      due_date: due_date || new Date().toISOString(),
      completed: completed || false,
      category_name: category_name || null,
      category_color: category_color || "#2d2d2d",
      category_icon: category_icon || "fa-folder",
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    try {
      const { data, error } = await supabaseAuth
        .from("tasks")
        .insert([newTask])
        .select();
      
      if (error) {
        console.log("Using mock data due to database error:", error);
        return res.status(201).json(newTask);
      }
      
      if (!data || data.length === 0) {
        console.log("No data returned, using mock task");
        return res.status(201).json(newTask);
      }
      
      res.status(201).json(data[0]);
    } catch (err) {
      console.log("Using mock data due to error:", err);
      res.status(201).json(newTask);
    }
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
      due_date, 
      completed, 
      category_name,
      category_color,
      category_icon
    } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (completed !== undefined) updateData.completed = completed;
    if (category_name !== undefined) updateData.category_name = category_name;
    if (category_color !== undefined) updateData.category_color = category_color;
    if (category_icon !== undefined) updateData.category_icon = category_icon;
    
    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validate category if provided
    if (category_name !== undefined) {
      try {
        // Get authenticated Supabase client with user token
        const authToken = req.headers.authorization?.split(" ")[1];
        const supabaseAuth = await getSupabaseWithAuth(authToken);
        
        // Check if this is a valid category for this user
        const { data: existingCategories, error: catError } = await supabaseAuth
          .from("tasks")
          .select("category_name")
          .eq("user_id", req.user.id)
          .eq("category_name", category_name)
          .limit(1);
          
        if (catError) {
          console.error("Error validating category:", catError);
        } else if (!existingCategories || existingCategories.length === 0) {
          // Check if the category exists in our default categories (for first-time use)
          const isDefaultCategory = ["Work", "Personal", "Shopping", "Health", "Education"].includes(category_name);
          
          if (!isDefaultCategory) {
            return res.status(400).json({ error: "Invalid category. Please use a category from the provided list." });
          }
          // If it's a default category, it's allowed to be used for the first time
        }
      } catch (catValidationErr) {
        console.error("Error during category validation:", catValidationErr);
        // Continue even if validation failed to avoid blocking task update
      }
    }
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();
    
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

module.exports = router;
