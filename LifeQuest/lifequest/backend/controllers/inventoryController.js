const shopService = require('../services/shopService');

async function listInventory(req, res, next) {
  try {
    const items = await shopService.listInventory(req.user.id);
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listInventory };
