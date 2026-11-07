import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import PropertyCard from '../components/PropertyCard';
import { SectionHead, EmptyState } from '../components/Layout';
import { api } from '../lib/api';
import { formatPrice, formatNumber, statusClass, timeAgo, monthlyPayment } from '../lib/format';
import { useFavorites } from '../context/FavoritesContext';

function Lightbox({ images, index, onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Photo gallery">
      <button className="lightbox__close" onClick={onClose} aria-label="Close gallery"><Icon name="close" size={20} /></button>
      <button className="lightbox__nav prev" onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous photo">&#10094;</button>
      <img src={images[index]} alt={`Photo ${index + 1}`} onClick={(e) => e.stopPropagation()} />
      <button className="lightbox__nav next" onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next photo">&#10095;</button>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { has, toggle } = useFavorites();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [mortgage, setMortgage] = useState({ downPct: 20, rate: 6.5, years: 30 });

  useEffect(() => {
    setLoading(true);
    api.property(id)
      .then((r) => { setProperty(r.data); setSimilar(r.similar); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const payment = useMemo(
    () => (property ? monthlyPayment({ price: property.price, ...mortgage }) : 0),
    [property, mortgage],
  );

  if (loading) return <div className="section"><div className="container"><div className="skeleton" style={{ height: 420 }} /></div></div>;

  if (error || !property) {
    return (
      <div className="section">
        <div className="container">
          <EmptyState icon="home" title="Property not found" text={error || 'This listing may have been sold or removed.'} action={{ to: '/properties', label: 'Back to properties' }} />
        </div>
      </div>
    );
  }

  const saved = has(property.id);
  const perSqft = Math.round(property.price / property.sqft);
  const hoa = Math.round((property.price * 0.011) / 12);

  const sendInquiry = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    try {
      await api.sendMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Inquiry: ${property.title}`,
        message: form.message,
        propertyId: property.id,
      });
      setStatus({ type: 'success', text: `Thanks ${form.name.split(' ')[0]} — ${property.agent?.name || 'the agent'} will reply within one business day.` });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  return (
    <>
      <section style={{ paddingTop: 26 }}>
        <div className="container">
          <p className="breadcrumb" style={{ color: 'var(--muted)' }}>
            <Link to="/">Home</Link> / <Link to="/properties">Properties</Link> / {property.title}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 18 }}>
        <div className="container">
          <div className="gallery">
            {property.images.slice(0, 5).map((src, i) => (
              <div key={src} className={`gallery__item${i === 0 ? ' gallery__item--main' : ''}`}>
                <img src={src} alt={`${property.title} photo ${i + 1}`} onClick={() => setLightbox(i)} />
              </div>
            ))}
          </div>
          <div className="detail-layout">
            <div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className={`badge badge--${statusClass(property.status)}`}>{property.status}</span>
                <span className="badge badge--gold">{property.type}</span>
                {property.featured && <span className="badge badge--featured">Featured</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)', marginBottom: 6 }}>{property.title}</h1>
                  <p className="muted" style={{ margin: 0 }}>
                    <Icon name="pin" size={15} /> {property.address}, {property.city}, {property.state} · {timeAgo(property.listedAt)}
                  </p>
                </div>
                <button className={`btn ${saved ? 'btn--primary' : 'btn--ghost'}`} onClick={() => toggle(property.id)}>
                  <Icon name="heart" size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="spec-grid" style={{ margin: '26px 0' }}>
                {[
                  { i: 'bed', v: property.beds, k: 'Bedrooms' },
                  { i: 'bath', v: property.baths, k: 'Bathrooms' },
                  { i: 'area', v: formatNumber(property.sqft), k: 'Sq ft' },
                  { i: 'car', v: property.parking, k: 'Parking' },
                ].map((s) => (
                  <div className="spec" key={s.k}>
                    <div className="spec__val"><Icon name={s.i} size={18} /> {s.v}</div>
                    <div className="spec__key">{s.k}</div>
                  </div>
                ))}
              </div>

              <div className="card card--pad" style={{ marginBottom: 26 }}>
                <h3>About this property</h3>
                <p>{property.description}</p>
                <div className="chip-row">
                  {property.amenities.map((a) => <span className="chip" key={a}><Icon name="check" size={14} /> {a}</span>)}
                </div>
              </div>

              <div className="card card--pad" style={{ marginBottom: 26 }}>
                <h3>Property details</h3>
                <table className="hours-table">
                  <tbody>
                    <tr><td>Property ID</td><td>{property.id}</td></tr>
                    <tr><td>Type</td><td>{property.type}</td></tr>
                    <tr><td>Year built</td><td>{property.yearBuilt}</td></tr>
                    <tr><td>Lot size</td><td>{property.lotSize} acres</td></tr>
                    <tr><td>Price per sq ft</td><td>${formatNumber(perSqft)}</td></tr>
                    <tr><td>Est. HOA dues</td><td>${formatNumber(hoa)} / month</td></tr>
                    <tr><td>Total views</td><td>{formatNumber(property.views)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="card card--pad">
                <h3><Icon name="gauge" size={20} /> Mortgage calculator</h3>
                <p className="muted" style={{ fontSize: '0.9rem' }}>Adjust the assumptions to estimate your monthly principal and interest.</p>
                <div className="grid grid--3" style={{ gap: 16 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="m-down">Down payment (%)</label>
                    <input id="m-down" className="input" type="number" min="0" max="100" value={mortgage.downPct} onChange={(e) => setMortgage({ ...mortgage, downPct: Number(e.target.value) })} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="m-rate">Interest rate (%)</label>
                    <input id="m-rate" className="input" type="number" step="0.1" value={mortgage.rate} onChange={(e) => setMortgage({ ...mortgage, rate: Number(e.target.value) })} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="m-years">Term (years)</label>
                    <input id="m-years" className="input" type="number" step="5" value={mortgage.years} onChange={(e) => setMortgage({ ...mortgage, years: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="checkout-row total">
                  <span>Estimated monthly payment</span>
                  <span>${formatNumber(Math.round(payment))}</span>
                </div>
              </div>
            </div>
            <aside>
              <div className="card sticky-card">
                <div className="detail-price">{formatPrice(property.price, property.status)}</div>
                <p className="muted" style={{ fontSize: '0.88rem' }}>
                  Est. ${formatNumber(Math.round(payment))} / month · ${formatNumber(perSqft)} / ft&sup2;
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '18px 0' }} />

                {property.agent && (
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
                    <img className="avatar avatar--lg" src={property.agent.photo} alt={property.agent.name} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{property.agent.name}</div>
                      <div style={{ fontSize: '0.85rem' }}>{property.agent.role}</div>
                      <a href={`tel:${property.agent.phone}`} className="muted" style={{ fontSize: '0.85rem' }}>{property.agent.phone}</a>
                    </div>
                  </div>
                )}

                {status.text && <div className={`alert alert--${status.type}`}>{status.text}</div>}

                <form onSubmit={sendInquiry}>
                  <div className="field">
                    <label htmlFor="i-name">Your name</label>
                    <input id="i-name" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="i-email">Email</label>
                    <input id="i-email" type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="i-phone">Phone (optional)</label>
                    <input id="i-phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="i-msg">Message</label>
                    <textarea id="i-msg" className="textarea" style={{ minHeight: 110 }} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="I'd like to arrange a viewing of this property…" />
                  </div>
                  <button className="btn btn--primary btn--block" type="submit"><Icon name="mail" size={16} /> Send inquiry</button>
                </form>

                <button className="btn btn--dark btn--block" style={{ marginTop: 10 }} onClick={() => setLightbox(0)}>
                  <Icon name="eye" size={16} /> View all {property.images.length} photos
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <SectionHead eyebrow="You may also like" title="Similar properties nearby" />
            <div className="grid grid--4">{similar.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
          </div>
        </section>
      )}

      {lightbox !== null && (
        <Lightbox
          images={property.images}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onStep={(d) => setLightbox((i) => (i + d + property.images.length) % property.images.length)}
        />
      )}
    </>
  );
}