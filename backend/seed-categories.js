// Script to seed default categories into the database
const { supabase } = require('./supabaseClient');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Default categories to add (global)
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

// Function to seed global categories (no userId)
async function seedCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .upsert(defaultCategories, { onConflict: ['name'] })
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
  // Run the seed function
  seedCategories()
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