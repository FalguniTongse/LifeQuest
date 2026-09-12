const express = require('express');
const controller = require('../controllers/questController');
const { validateQuest } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', controller.list);
router.post('/', validateQuest, controller.create);
router.get('/:id', controller.getOne);
router.put('/:id', validateQuest, controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/complete', controller.complete);

module.exports = router;
