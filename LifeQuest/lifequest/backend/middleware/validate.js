const { AppError } = require('./errorHandler');

const CATEGORIES = [
  'Coding',
  'Study',
  'Reading',
  'Fitness',
  'Meditation',
  'Art',
  'Social',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

function validateRegister(req, res, next) {
  const {
    username,
    email,
    password,
    confirmPassword,
  } = req.body;

  if (!username || username.trim().length < 3) {
    return next(
      new AppError('Username must be at least 3 characters.', 400)
    );
  }

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return next(
      new AppError('A valid email address is required.', 400)
    );
  }

  if (!password || password.length < 8) {
    return next(
      new AppError('Password must be at least 8 characters.', 400)
    );
  }

  if (password !== confirmPassword) {
    return next(
      new AppError(
        'Password and confirmation do not match.',
        400
      )
    );
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('Email and password are required.', 400)
    );
  }

  next();
}

function validateQuest(req, res, next) {
  const { title, category, difficulty, dueDate } = req.body;

  if (!title || !title.trim()) {
    return next(new AppError('Quest title is required.', 400));
  }

  if (title.trim().length > 120) {
    return next(
      new AppError('Quest title must be under 120 characters.', 400)
    );
  }

  if (!CATEGORIES.includes(category)) {
    return next(
      new AppError(
        `Category must be one of: ${CATEGORIES.join(', ')}.`,
        400
      )
    );
  }

  if (!DIFFICULTIES.includes(difficulty)) {
    return next(
      new AppError(
        `Difficulty must be one of: ${DIFFICULTIES.join(', ')}.`,
        400
      )
    );
  }

  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    return next(new AppError('Due date is invalid.', 400));
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateQuest,
  CATEGORIES,
  DIFFICULTIES,
};