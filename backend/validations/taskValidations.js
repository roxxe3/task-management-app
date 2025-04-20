const { body, query, param } = require('express-validator');

const taskValidations = {
  getTasks: [
    query('status').optional().isIn(['completed', 'active']),
    query('category_id').optional().isUUID(),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('search').optional().isString()
  ],

  getTask: [
    param('id').isUUID().withMessage('Invalid task ID format')
  ],

  createTask: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('completed').optional().isBoolean(),
    body('category_id').optional().isUUID(),
    body('position').optional().isInt({ min: 0 })
  ],

  updateTask: [
    param('id').isUUID().withMessage('Invalid task ID format'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('completed').optional().isBoolean(),
    body('category_id').optional().isUUID()
  ],

  deleteTask: [
    param('id').isUUID().withMessage('Invalid task ID format')
  ],

  updateTaskPosition: [
    param('id').isUUID().withMessage('Invalid task ID format'),
    body('newPosition').isInt({ min: 0 }).withMessage('Position must be a non-negative integer')
  ]
};

module.exports = taskValidations; 