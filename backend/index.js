const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Simple endpoint to test server
app.get("/", (req, res) => {
  res.send("Backend is running!!!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
