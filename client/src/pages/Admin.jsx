import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero, EmptyState } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { formatPrice, formatDate } from '../lib/format';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('listings');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [s, p, m] = await Promise.all([
          api.stats(),
          api.properties({ limit: 20, sort: 'newest' }),
          isAdmin ? api.messages() : Promise.resolve({ data: [] }),
        ]);
        setStats(s.data);
        setProperties(p.data);
        setMessages(m.data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="section">
        <div className="container">
          <EmptyState
            icon="shield"
            title="Admin access required"
            text="Sign in with an admin account to manage listings and enquiries."
            action={{ to: '/login', label: 'Sign in' }}
          />
        </div>
      </div>
    );
  }

  const deleteProperty = async (id) => {
    setBusy(id);
    try {
      await api.deleteProperty(id);
      setProperties((rows) => rows.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const markRead = async (id) => {
    try {
      await api.markMessageRead(id);
      setMessages((rows) => rows.map((m) => (m.id === id ? { ...m, status: 'read' } : m)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHero title="Admin dashboard" subtitle="Manage listings and follow up on enquiries from the website.">
        <p className="breadcrumb"><Link to="/">Home</Link> / Admin</p>
      </PageHero>

      <section className="section">
        <div className="container">
          {error && <div className="alert alert--error">{error}</div>}

          <div className="admin-stats">
            {[
              { n: stats?.listings ?? '—', l: 'Listings' },
              { n: stats?.cities ?? '—', l: 'Cities' },
              { n: stats?.agents ?? '—', l: 'Agents' },
              { n: stats?.avgRating ?? '—', l: 'Avg rating' },
            ].map((s) => (
              <div className="admin-stat" key={s.l}>
                <div className="admin-stat__num">{s.n}</div>
                <div className="admin-stat__label">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="tabs">
            <button className={tab === 'listings' ? 'active' : ''} onClick={() => setTab('listings')}>Listings ({properties.length})</button>
            <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Enquiries ({messages.length})</button>
          </div>

          {tab === 'listings' && (
            <div className="card table-wrap">
              <table className="table">
                <thead><tr><th>Property</th><th>Price</th><th>Status</th><th>Views</th><th /></tr></thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/properties/${p.slug}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.title}</Link>
                        <div style={{ fontSize: '0.82rem' }}>{p.address}, {p.city}</div>
                      </td>
                      <td>{formatPrice(p.price, p.status)}</td>
                      <td><span className={`badge badge--${p.status === 'Sold' ? 'sold' : p.status === 'For Rent' ? 'rent' : 'sale'}`}>{p.status}</span></td>
                      <td>{p.views}</td>
                      <td>
                        <button className="btn btn--ghost btn--sm" onClick={() => deleteProperty(p.id)} disabled={busy === p.id}>
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === 'messages' && (
            messages.length === 0
              ? <EmptyState icon="chat" title="No enquiries yet" text="Messages sent from the contact and property pages land here." />
              : (
                <div className="card table-wrap">
                  <table className="table">
                    <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Received</th><th /></tr></thead>
                    <tbody>
                      {messages.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{m.name}</div>
                            <div style={{ fontSize: '0.82rem' }}>{m.email}</div>
                          </td>
                          <td>{m.subject}</td>
                          <td style={{ maxWidth: 320 }}>{m.message}</td>
                          <td>{formatDate(m.createdAt)}</td>
                          <td>
                            {m.status === 'new'
                              ? <button className="btn btn--dark btn--sm" onClick={() => markRead(m.id)}>Mark read</button>
                              : <span className="muted" style={{ fontSize: '0.85rem' }}>Read</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}
        </div>
      </section>
    </>
  );
}