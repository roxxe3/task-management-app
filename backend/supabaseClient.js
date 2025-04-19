const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if the required environment variables are set properly
if (!supabaseUrl || !supabaseKey || 
    supabaseUrl === 'https://your-supabase-project-url.supabase.co' || 
    supabaseKey === 'your-supabase-anon-key-here') {
  console.error('==================================================================');
  console.error('ERROR: Missing or invalid Supabase credentials in .env file');
  console.error('Please update your .env file with actual Supabase credentials');
  console.error('from your Supabase project settings at https://supabase.com/dashboard');
  console.error('==================================================================');
  process.exit(1); // Exit the process to prevent the server from starting without proper credentials
}

// Initialize and export the Supabase client
try {
  // Create the anonymous Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Connected to Supabase successfully');
  
  // Create a function to get a Supabase instance with auth context
  const getSupabaseWithAuth = async (authToken) => {
    if (!authToken) {
      console.warn('No auth token provided to getSupabaseWithAuth');
      return supabase; // Return the anonymous client as fallback
    }
    
    try {
      // Create a new Supabase client with the auth token
      const supabaseWithAuth = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      return supabaseWithAuth;
    } catch (error) {
      console.error('Error setting up authenticated Supabase client:', error);
      return supabase; // Fall back to unauthenticated client
    }
  };
  
  module.exports = {
    supabase,
    getSupabaseWithAuth
  };
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  process.exit(1); // Exit the process on connection failure
}
