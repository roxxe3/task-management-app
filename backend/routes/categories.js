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

module.exports = router;
