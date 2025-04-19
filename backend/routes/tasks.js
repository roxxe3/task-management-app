const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const authMiddleware = require("../middleware/auth");

// Use auth middleware for all routes
router.use(authMiddleware);

// GET /tasks - List tasks with optional filtering
router.get("/", async (req, res) => {
  const { status, category } = req.query;
  let query = supabase.from("tasks").select("*").eq("user_id", req.user.id);

  if (status) {
    query = query.eq("completed", status === "completed");
  }
  if (category) {
    query = query.eq("category_id", category);
  }

  const { data, error } = await query;
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// POST /tasks - Create a new task
router.post("/", async (req, res) => {
  const { title, category_id, priority } = req.body;
  const { data, error } = await supabase.from("tasks").insert([
    { title, category_id, priority, user_id: req.user.id }
  ]);
  if (error) return res.status(400).json({ error });
  res.status(201).json(data);
});

// PUT /tasks/:id - Edit/update a task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed, category_id, priority } = req.body;
  const { data, error } = await supabase.from("tasks")
    .update({ title, completed, category_id, priority })
    .eq("id", id)
    .eq("user_id", req.user.id);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);
  if (error) return res.status(400).json({ error });
  res.json({ message: "Task deleted" });
});

module.exports = router;
