const supabase = require("../supabaseClient");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user; // attach user info to request
  next();
};
// This middleware checks for the presence of an authorization header in the request.
// If the header is present, it extracts the token and uses Supabase's auth client to verify it.