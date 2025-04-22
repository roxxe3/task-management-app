const express = require("express");
const router = express.Router();
const { supabase, getSupabaseWithAuth } = require("../supabaseClient");
const authMiddleware = require("../middleware/auth");

// Default categories fallback
const defaultCategories = [
  { name: 'Work', color: '#0284c7', icon: 'fa-briefcase' },
  { name: 'Personal', color: '#7e22ce', icon: 'fa-user' },
  { name: 'Shopping', color: '#16a34a', icon: 'fa-shopping-cart' },
  { name: 'Health', color: '#dc2626', icon: 'fa-heart' },
];

// Use auth middleware for all routes
router.use(authMiddleware);

// GET /categories - List all categories
router.get("/", async (req, res) => {
  try {
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Supabase error fetching categories:", error);
      if (error.code === '42P01') {
        console.warn('Categories table missing, returning default categories');
        return res.json(defaultCategories);
      }
      return res.status(500).json({ 
        error: "Database error fetching categories", 
        details: error.message,
        code: error.code 
      });
    }
    
    // If no categories found, return empty array
    if (!data) {
      return res.json([]);
    }
    
    res.json(data);
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
  }
});

// GET /categories/:id - Get a single category
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Supabase error fetching category:", error);
      return res.status(500).json({ 
        error: "Database error fetching category", 
        details: error.message,
        code: error.code 
      });
    }
    
    // Check if category exists
    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(data);
  } catch (err) {
    console.error("Unexpected error fetching category:", err);
    res.status(500).json({ error: "Failed to fetch category", details: err.message });
  }
});

// POST /categories - Create a new category
router.post("/", async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    
    const categoryData = { 
      name, 
      color: color || "#2d2d2d",
      icon: icon || "fa-folder"
    };
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .insert([categoryData])
      .select();
      
    if (error) {
      console.error("Supabase error creating category:", error);
      return res.status(500).json({ 
        error: "Database error creating category", 
        details: error.message,
        code: error.code 
      });
    }

    // Check if data was returned
    if (!data || data.length === 0) {
      return res.status(500).json({ error: "No data returned from database after category creation" });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Unexpected error creating category:", err);
    res.status(500).json({ error: "Server error creating category", details: err.message });
  }
});

// PUT /categories/:id - Update a category
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    
    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select();
      
    if (error) {
      console.error("Supabase error updating category:", error);
      return res.status(500).json({ 
        error: "Database error updating category", 
        details: error.message,
        code: error.code 
      });
    }
    
    // Check if category exists
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error("Unexpected error updating category:", err);
    res.status(500).json({ error: "Server error updating category", details: err.message });
  }
});

// DELETE /categories/:id - Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken);
    
    // First check if category is being used by any tasks
    const { data: tasks, error: taskError } = await supabaseAuth
      .from("tasks")
      .select("id")
      .eq("category_id", id)
      .limit(1);

    if (taskError) {
      console.error("Error checking for tasks using category:", taskError);
      return res.status(500).json({ 
        error: "Failed to check for tasks using this category",
        details: taskError.message 
      });
    }

    // If tasks are using this category, prevent deletion
    if (tasks && tasks.length > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category that has tasks assigned to it" 
      });
    }

    // If no tasks are using the category, proceed with deletion
    const { error } = await supabaseAuth
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ 
        error: "Failed to delete category",
        details: error.message 
      });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Unexpected error deleting category:", err);
    res.status(500).json({ 
      error: "Server error deleting category",
      details: err.message 
    });
  }
});

module.exports = router;
