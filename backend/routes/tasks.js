const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const taskValidations = require("../validations/taskValidations");
const validate = require("../middleware/validator");
const authMiddleware = require("../middleware/auth");

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
router.get("/categories/unique", taskController.getUniqueCategories);

// PUT /tasks/:id/position - Update task position
router.put("/:id/position",
  taskValidations.updateTaskPosition,
  validate(taskValidations.updateTaskPosition),
  taskController.updateTaskPosition
);

module.exports = router;
