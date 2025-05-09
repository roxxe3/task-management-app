/**
 * Authentication middleware for protecting API routes using Supabase JWT tokens
 */
const { supabase } = require('../supabaseClient');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required", details: "Missing or invalid authorization header" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify the token and get user
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error("Auth validation error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Attach the user data to the request
    req.user = data.user;
    
    // Add userId for convenience
    req.userId = data.user.id;
    
    // Store the token for future use
    req.token = token;
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
};

module.exports = authMiddleware;