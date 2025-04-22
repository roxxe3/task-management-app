/**
 * Authentication routes for the task management API
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup attempt for email:', req.body.email);
    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Try to sign in with the email to check if it exists
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-check' // Use a dummy password
    });

    console.log('Sign in check response:', signInError);

    // If there's no error or the error is about invalid credentials (not user not found),
    // then the user exists
    if (!signInError || signInError.message?.includes('Invalid login credentials')) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Register user with Supabase auth
    console.log('Attempting to create user...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email`
      }
    });

    console.log('Signup response:', { data, error });

    if (error) {
      console.error('Signup error:', error);
      
      // Check for existing user errors
      if (error.message?.toLowerCase().includes('already registered') || 
          error.message?.toLowerCase().includes('already exists') ||
          error.status === 400) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      
      return res.status(400).json({ error: error.message });
    }

    // If we get here and there's no session, it means email verification is required
    if (!data.session) {
      console.log('Email verification required');
      return res.status(400).json({
        error: 'An account with this email already exists'
      });
    }

    // Return user data and session
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || '',
    };

    console.log('User created successfully:', userData);
    res.status(201).json({
      user: userData,
      token: data.session.access_token,
      emailVerified: true
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