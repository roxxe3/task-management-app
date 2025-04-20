const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const taskValidations = require("../validations/taskValidations");
const validate = require("../middleware/validator");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid');

// Use auth middleware for all task routes
router.use(authMiddleware);

// GET /tasks - Fetch all tasks with optional filtering
router.get("/", 
  taskValidations.getTasks,
  validate(taskValidations.getTasks),
  taskController.getTasks
);

// GET /tasks/:id - Get a single task
router.get("/:id",
  taskValidations.getTask,
  validate(taskValidations.getTask),
  taskController.getTask
);

// POST /tasks - Create a new task
router.post("/",
  taskValidations.createTask,
  validate(taskValidations.createTask),
  taskController.createTask
);

// PUT /tasks/:id - Update an existing task
router.put("/:id",
  taskValidations.updateTask,
  validate(taskValidations.updateTask),
  taskController.updateTask
);

// DELETE /tasks/:id - Delete a task
router.delete("/:id",
  taskValidations.deleteTask,
  validate(taskValidations.deleteTask),
  taskController.deleteTask
);

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
