const helmet = require('helmet');
const config = require('../config/config');

// Middleware setup function
const setupSecurityMiddleware = (app) => {
  // Basic Helmet configuration with essential headers only
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity
  }));

  // Simple XSS prevention middleware
  app.use((req, res, next) => {
    if (req.body) {
      // Sanitize request body (simplified)
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key]
            .replace(/[<>]/g, ''); // Basic XSS protection - remove < and >
        }
      });
    }
    next();
  });

  // Disable X-Powered-By header
  app.disable('x-powered-by');
};

module.exports = setupSecurityMiddleware; 