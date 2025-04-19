const express = require("express");
const router = express.Router();
const { supabase, getSupabaseWithAuth } = require("../supabaseClient");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid'); // Add UUID package

// Sample mock data for development with proper UUID format
const mockCategories = [
  {
    id: "personal-category-id-123",
    name: "Personal",
    color: "#2d2d2d",
    icon: "fa-user",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  },
  {
    id: "work-category-id-123",
    name: "Work",
    color: "#2d2d2d",
    icon: "fa-briefcase",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  },
  {
    id: "shopping-category-id-123",
    name: "Shopping",
    color: "#2d2d2d",
    icon: "fa-shopping-cart",
    user_id: "demo-user-id",
    created_at: new Date().toISOString()
  }
];

// Use auth middleware for all routes
router.use(authMiddleware);

// GET /categories - List all categories
router.get("/", async (req, res) => {
  try {
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken); // Add await here
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .select("*")
      .eq("user_id", req.user.id);
      
    if (error) {
      console.error("Supabase error fetching categories:", error);
      return res.status(500).json({ 
        error: "Database error fetching categories", 
        details: error.message,
        code: error.code 
      });
    }

    // If no data or using mock client, return mock categories
    if (!data || data.length === 0) {
      console.log("No categories found in database, returning mock data");
      return res.json(mockCategories);
    }
    
    res.json(data);
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
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
      icon: icon || "fa-folder",
      user_id: req.user.id 
    };
    
    // Get authenticated Supabase client with user token
    const authToken = req.headers.authorization?.split(" ")[1];
    const supabaseAuth = await getSupabaseWithAuth(authToken); // Add await here
    
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
    const supabaseAuth = await getSupabaseWithAuth(authToken); // Add await here
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", req.user.id)
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
      return res.status(404).json({ error: "Category not found or you don't have permission to update it" });
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
    const supabaseAuth = await getSupabaseWithAuth(authToken); // Add await here
    
    // First check if category is being used by any tasks
    const { data: tasks, error: taskError } = await supabaseAuth
      .from("tasks")
      .select("id")
      .eq("category_id", id)
      .limit(1);
    
    if (taskError) {
      console.error("Supabase error checking category tasks:", taskError);
      return res.status(500).json({ 
        error: "Error checking if category is in use", 
        details: taskError.message 
      });
    }
    
    // If tasks are using this category, return an error
    if (tasks && tasks.length > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category: it is used by one or more tasks",
        solution: "Either reassign or delete the tasks first" 
      });
    }
    
    const { data, error } = await supabaseAuth
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();
      
    if (error) {
      console.error("Supabase error deleting category:", error);
      return res.status(500).json({ 
        error: "Database error deleting category", 
        details: error.message,
        code: error.code 
      });
    }
    
    // Check if category was found and deleted
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Category not found or you don't have permission to delete it" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Unexpected error deleting category:", err);
    res.status(500).json({ error: "Server error deleting category", details: err.message });
  }
});

module.exports = router;
