const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const setupSecurityMiddleware = require("./middleware/security");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const app = express();

// Middleware order is important!
// 1. Parse JSON bodies first
app.use(express.json());

// 2. CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// 3. Security middleware (after parsing but before routes)
setupSecurityMiddleware(app);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoriesRouter);

// Simple endpoint to test server
app.get("/", (req, res) => {
  res.send("Task Management Backend API is running with Supabase integration!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: "Validation error", 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: "Authentication error", 
      details: err.message 
    });
  }
  
  // Default server error
  res.status(500).json({ 
    error: "Server error",
    message: process.env.NODE_ENV === 'development' ? err.message : "An unexpected error occurred"
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${process.env.NODE_ENV || 'development'} mode`);
});
