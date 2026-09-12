const { withTransaction, query } = require('../db/connection');
const { AppError } = require('../middleware/errorHandler');

async function listItems() {
  const { rows } = await query('SELECT * FROM items ORDER BY price ASC');
  return rows;
}

async function listInventory(userId) {
  const { rows } = await query(
    `SELECT i.*, inv.purchased_at FROM inventory inv
     JOIN items i ON i.id = inv.item_id
     WHERE inv.user_id = $1
     ORDER BY inv.purchased_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Authoritative purchase transaction: verifies the item exists, the user can afford it,
 * and (for unique items) that it isn't already owned, then atomically deducts Gold and
 * inserts the inventory record.
 */
async function purchaseItem(userId, itemId) {
  return withTransaction(async (client) => {
    const { rows: itemRows } = await client.query('SELECT * FROM items WHERE id = $1', [itemId]);
    if (itemRows.length === 0) {
      throw new AppError('Item not found.', 404);
    }
    const item = itemRows[0];

    if (item.unique_item) {
      const { rows: owned } = await client.query(
        'SELECT id FROM inventory WHERE user_id = $1 AND item_id = $2',
        [userId, itemId]
      );
      if (owned.length > 0) {
        throw new AppError('You already own this item.', 400);
      }
    }

    const { rows: charRows } = await client.query(
      'SELECT gold FROM characters WHERE user_id = $1 FOR UPDATE',
      [userId]
    );
    const character = charRows[0];

    if (character.gold < item.price) {
      throw new AppError('You do not have enough Gold for this item.', 400);
    }

    await client.query('UPDATE characters SET gold = gold - $1, updated_at = NOW() WHERE user_id = $2', [
      item.price,
      userId,
    ]);

    await client.query(
      'INSERT INTO inventory (user_id, item_id) VALUES ($1, $2) ON CONFLICT (user_id, item_id) DO NOTHING',
      [userId, itemId]
    );

    const { rows: updatedChar } = await client.query('SELECT gold FROM characters WHERE user_id = $1', [userId]);

    return { item, remainingGold: updatedChar[0].gold };
  });
}

module.exports = { listItems, listInventory, purchaseItem };
