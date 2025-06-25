const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Journal entry validation
const validateJournalEntry = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Entry title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Entry content is required')
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10,000 characters'),
  
  body('mood')
    .notEmpty()
    .withMessage('Mood selection is required')
    .isIn([
      'very-happy', 'happy', 'content', 'neutral', 'slightly-sad', 
      'sad', 'very-sad', 'anxious', 'stressed', 'angry', 'frustrated', 
      'excited', 'grateful', 'hopeful', 'confused', 'overwhelmed'
    ])
    .withMessage('Invalid mood selection'),
  
  body('moodIntensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood intensity must be between 1 and 10'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('isImportant')
    .optional()
    .isBoolean()
    .withMessage('isImportant must be a boolean'),
  
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('profile.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  
  body('profile.timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a string'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  
  body('preferences.notifications.dailyReminder')
    .optional()
    .isBoolean()
    .withMessage('Daily reminder preference must be a boolean'),
  
  body('preferences.notifications.weeklyInsights')
    .optional()
    .isBoolean()
    .withMessage('Weekly insights preference must be a boolean'),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateJournalEntry,
  validateProfileUpdate,
  validatePasswordChange,
  handleValidationErrors
};