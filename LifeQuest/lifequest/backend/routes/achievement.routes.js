const express = require('express');
const { listAll, listUnlocked } = require('../controllers/achievementController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', listAll);
router.get('/user', listUnlocked);

module.exports = router;
