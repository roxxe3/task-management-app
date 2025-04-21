/**
 * Authentication middleware for protecting API routes using Supabase JWT tokens
 */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required Supabase environment variables');
}

// Initialize supabase client outside request handler for better performance
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

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