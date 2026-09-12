const shopService = require('../services/shopService');

async function listItems(req, res, next) {
  try {
    const items = await shopService.listItems();
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function buyItem(req, res, next) {
  try {
    const result = await shopService.purchaseItem(req.user.id, req.params.itemId);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { listItems, buyItem };
