import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../services/api';
import AppLayout from '../components/AppLayout';

export default function Inventory() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/inventory')
      .then(({ data }) => setItems(data.items))
      .catch((err) => setError(apiErrorMessage(err, 'Could not load your inventory.')));
  }, []);

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Inventory</h1>
          <p className="lede">Everything you've unlocked stays with you.</p>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {items === null ? (
        <div className="grid-4">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 190 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="panel">
          <div className="empty-state">
            <h4>Your inventory is empty</h4>
            <p>Visit the shop to spend your Gold on something worth keeping.</p>
          </div>
        </div>
      ) : (
        <div className="grid-4">
          {items.map((item) => (
            <div className="item-card" key={item.id}>
              <span className={`item-rarity ${item.rarity}`}>{item.rarity}</span>
              <div className="item-name">{item.name}</div>
              <div className="item-desc">{item.description}</div>
              <div className="item-footer">
                <span style={{ color: 'var(--parchment-dim)', fontSize: '0.78rem' }}>
                  Acquired {new Date(item.purchased_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
