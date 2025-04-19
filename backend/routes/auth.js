/**
 * Authentication routes for the task management API
 */
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const authMiddleware = require('../middleware/auth');
const { seedCategories } = require('../seed-categories'); // Import the seed function

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Register user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Create default categories for the new user
    if (data.user) {
      try {
        await seedCategories(data.user.id);
        console.log(`Created default categories for new user: ${data.user.id}`);
      } catch (seedError) {
        // Don't fail signup if category creation fails, just log it
        console.error('Failed to create default categories:', seedError);
      }
    }

    // Return user data and session
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || '',
    };

    res.status(201).json({
      user: userData,
      token: data.session?.access_token || ''
    });
  } catch (error) {
    console.error('Server error during signup:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user data and session
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || '',
    };

    res.json({
      user: userData,
      token: data.session.access_token
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

/**
 * @route   GET /api/auth/validate-token
 * @desc    Validate the user's token and return user data
 * @access  Private
 */
router.get('/validate-token', authMiddleware, (req, res) => {
  try {
    // req.user is set by the auth middleware
    const userData = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.name || '',
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Invalidate the user's session
 * @access  Private
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

module.exports = router;