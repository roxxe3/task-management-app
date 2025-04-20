const { validationResult } = require('express-validator');

// Middleware to validate request
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      error: 'Validation error',
      details: errors.array()
    });
  };
};

module.exports = validate; 