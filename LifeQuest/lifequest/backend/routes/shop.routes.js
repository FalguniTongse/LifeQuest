const express = require('express');
const { listItems, buyItem } = require('../controllers/shopController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', listItems);
router.post('/:itemId/buy', buyItem);

module.exports = router;
