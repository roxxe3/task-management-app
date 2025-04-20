const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const supabase = require("./supabaseClient");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);

// Simple endpoint to test server
app.get("/", (req, res) => {
  res.send("Task Management Backend API is running with Supabase integration!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Supabase integration`);
});
