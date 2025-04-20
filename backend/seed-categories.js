// Script to seed default categories into the database
const { supabase } = require('./supabaseClient');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Default categories to add
const defaultCategories = [
  {
    name: 'Work',
    color: '#0284c7', // sky blue
    icon: 'fa-briefcase',
  },
  {
    name: 'Personal',
    color: '#7e22ce', // purple
    icon: 'fa-user',
  },
  {
    name: 'Shopping',
    color: '#16a34a', // green
    icon: 'fa-shopping-cart',
  },
  {
    name: 'Health',
    color: '#dc2626', // red
    icon: 'fa-heart',
  },
  {
    name: 'Education',
    color: '#ea580c', // orange
    icon: 'fa-book',
  },
];

// Function to seed categories for a specific user
async function seedCategories(userId) {
  if (!userId) {
    console.error('User ID is required to seed categories');
    return { error: 'User ID is required' };
  }

  console.log(`Adding default categories for user ${userId}...`);

  try {
    // Prepare categories with user ID
    const categoriesToInsert = defaultCategories.map(category => ({
      ...category,
      user_id: userId
    }));

    // Insert categories
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();

    if (error) {
      console.error('Error seeding categories:', error);
      return { error: error.message };
    } else {
      console.log('Categories added successfully!', data);
      return { success: true, categories: data };
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

// If running directly (not imported)
if (require.main === module) {
  // Check for user ID from command line arguments
  const userId = process.argv[2];
  
  if (!userId) {
    console.error('Please provide a user ID as a command-line argument');
    console.log('Usage: node seed-categories.js YOUR_USER_ID');
    process.exit(1);
  }

  // Run the seed function
  seedCategories(userId)
    .then((result) => {
      if (result.error) {
        console.error('Error seeding categories:', result.error);
        process.exit(1);
      }
      console.log('Seeding completed successfully!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error in seeding process:', err);
      process.exit(1);
    });
}

module.exports = { seedCategories };