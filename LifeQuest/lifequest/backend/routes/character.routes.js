const express = require('express');
const { getCharacter, getStats } = require('../controllers/characterController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', getCharacter);
router.get('/stats', getStats);

module.exports = router;
