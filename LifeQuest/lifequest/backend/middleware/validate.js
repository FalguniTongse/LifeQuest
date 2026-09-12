const { AppError } = require('./errorHandler');

const CATEGORIES = ['Coding', 'Study', 'Reading', 'Fitness', 'Meditation', 'Art', 'Social'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

function validateRegister(req, res, next) {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || username.trim().length < 3) {
    return next(new AppError('Username must be at least 3 characters.'));
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('A valid email address is required.'));
  }
  if (!password || password.length < 8) {
    return next(new AppError('Password must be at least 8 characters.'));
  }
  if (password !== confirmPassword) {
    return next(new AppError('Password and confirmation do not match.'));
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required.'));
  }
  next();
}

function validateQuest(req, res, next) {
  const { title, category, difficulty, dueDate } = req.body;
  if (!title || !title.trim()) {
    return next(new AppError('Quest title is required.'));
  }
  if (title.length > 120) {
    return next(new AppError('Quest title must be under 120 characters.'));
  }
  if (!CATEGORIES.includes(category)) {
    return next(new AppError(`Category must be one of: ${CATEGORIES.join(', ')}.`));
  }
  if (!DIFFICULTIES.includes(difficulty)) {
    return next(new AppError(`Difficulty must be one of: ${DIFFICULTIES.join(', ')}.`));
  }
  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    return next(new AppError('Due date is invalid.'));
  }
  next();
}

module.exports = { validateRegister, validateLogin, validateQuest, CATEGORIES, DIFFICULTIES };
