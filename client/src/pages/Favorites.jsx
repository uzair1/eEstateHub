import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PropertyCard from '../components/PropertyCard';
import { PageHero, EmptyState } from '../components/Layout';
import { useFavorites } from '../context/FavoritesContext';
import { api } from '../lib/api';

export default function Favorites() {
  const { ids } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setItems([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(ids.map((id) => api.property(id).then((r) => r.data).catch(() => null)))
      .then((rows) => setItems(rows.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <>
      <PageHero title="Saved properties" subtitle="Your shortlist, stored in this browser. Sign in to keep it on every device.">
        <p className="breadcrumb"><Link to="/">Home</Link> / Favorites</p>
      </PageHero>

      <section className="section">
        <div className="container">
          {loading && <div className="grid grid--3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 380 }} />)}</div>}

          {!loading && items.length === 0 && (
            <EmptyState
              icon="heart"
              title="Nothing saved yet"
              text="Tap the heart on any listing to build a shortlist you can send to an agent."
              action={{ to: '/properties', label: 'Browse properties' }}
            />
          )}

          {!loading && items.length > 0 && (
            <>
              <p className="muted" style={{ marginBottom: 24 }}><Icon name="heart" size={15} fill="currentColor" /> {items.length} saved propert{items.length > 1 ? 'ies' : 'y'}</p>
              <div className="grid grid--3">{items.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
            </>
          )}
        </div>
      </section>
    </>
  );
}