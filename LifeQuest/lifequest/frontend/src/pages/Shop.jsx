import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../services/api';
import { useGame } from '../context/GameContext';
import AppLayout from '../components/AppLayout';

export default function Shop() {
  const { character, refreshCharacter, pushToast } = useGame();
  const [items, setItems] = useState(null);
  const [owned, setOwned] = useState(new Set());
  const [error, setError] = useState('');
  const [buyingId, setBuyingId] = useState(null);

  async function loadShop() {
    try {
      const [itemsRes, invRes] = await Promise.all([api.get('/shop'), api.get('/inventory')]);
      setItems(itemsRes.data.items);
      setOwned(new Set(invRes.data.items.map((i) => i.id)));
      await refreshCharacter();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load the shop.'));
    }
  }

  useEffect(() => {
    loadShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleBuy(item) {
    setError('');
    setBuyingId(item.id);
    try {
      await api.post(`/shop/${item.id}/buy`);
      pushToast('Purchased', `${item.name} is now in your inventory.`);
      setOwned((prev) => new Set(prev).add(item.id));
      await refreshCharacter();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not complete that purchase.'));
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Shop</h1>
          <p className="lede">Spend the Gold you've earned on cosmetics for your journal.</p>
        </div>
        {character && (
          <div className="stat-card" style={{ minWidth: 140 }}>
            <div className="stat-label">Your Gold</div>
            <div className="stat-value gold">{character.gold}</div>
          </div>
        )}
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {items === null ? (
        <div className="grid-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 190 }} />)}
        </div>
      ) : (
        <div className="grid-4">
          {items.map((item) => {
            const isOwned = owned.has(item.id);
            const canAfford = character ? character.gold >= item.price : true;
            return (
              <div className="item-card" key={item.id}>
                <span className={`item-rarity ${item.rarity}`}>{item.rarity}</span>
                <div className="item-name">{item.name}</div>
                <div className="item-desc">{item.description}</div>
                <div className="item-footer">
                  <span className="item-price">{item.price}g</span>
                  <button
                    className={`btn btn-sm ${isOwned ? 'btn-outline' : 'btn-primary'}`}
                    disabled={isOwned || buyingId === item.id || !canAfford}
                    onClick={() => handleBuy(item)}
                  >
                    {isOwned ? 'Owned' : buyingId === item.id ? 'Buying…' : canAfford ? 'Buy' : 'Not enough Gold'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
