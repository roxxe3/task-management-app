const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const config = require('../config/config');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware setup function
const setupSecurityMiddleware = (app) => {
  // Helmet helps secure Express apps by setting various HTTP headers
  app.use(helmet());

  // Rate limiting
  app.use(limiter);

  // Custom XSS prevention middleware (safer than xss-clean)
  app.use((req, res, next) => {
    if (req.body) {
      // Sanitize request body
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key]
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/data:/gi, '') // Remove data: protocol
            .replace(/\b(on\w+)="[^"]*"/g, ''); // Remove event handlers
        }
      });
    }
    next();
  });

  // Disable X-Powered-By header
  app.disable('x-powered-by');
};

module.exports = setupSecurityMiddleware; 