const express = require('express');
const { register, login, logout, me } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
