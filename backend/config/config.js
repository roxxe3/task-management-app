const dotenv = require('dotenv');
dotenv.config();

const config = {
  development: {
    port: process.env.PORT || 5000,
    corsOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  test: {
    port: process.env.TEST_PORT || 5001,
    corsOrigins: ['http://localhost:5173'],
    supabaseUrl: process.env.TEST_SUPABASE_URL,
    supabaseKey: process.env.TEST_SUPABASE_KEY,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },
  production: {
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 60 // stricter rate limiting in production
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment]; 