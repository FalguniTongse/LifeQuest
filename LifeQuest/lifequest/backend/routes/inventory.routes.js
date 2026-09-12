const express = require('express');
const { listInventory } = require('../controllers/inventoryController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, listInventory);

module.exports = router;
