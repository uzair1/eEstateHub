import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { SectionHead, CtaBand } from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { api } from '../lib/api';

const HERO_BG = '/images/hero.jpg';

const STEPS = [
  { n: '01', t: 'Tell us what matters', d: 'Budget, commute, school catchments, must-have features. A 20-minute call replaces weeks of scrolling.' },
  { n: '02', t: 'Get a curated shortlist', d: 'Agents hand-pick matching homes plus off-market opportunities you will not find on any portal.' },
  { n: '03', t: 'Tour, negotiate, close', d: 'We arrange viewings, handle negotiation and manage escrow, inspections and paperwork end to end.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    api.properties({ featured: 'true', limit: 6 }).then((r) => setFeatured(r.data)).catch(() => {});
    api.properties({ limit: 1 }).then((r) => { setCities(r.filters.cities); setTypes(r.filters.types); }).catch(() => {});
    api.services().then((r) => setServices(r.data.slice(0, 3))).catch(() => {});
    api.testimonials().then((r) => setTestimonials(r.data.slice(0, 3))).catch(() => {});
    api.stats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="container">
          <div className="hero__inner">
            <span className="eyebrow">Est. 2009 · 8 markets · 1,240 clients</span>
            <h1>Where finding a home finally feels simple.</h1>
            <p>
              EstateHub pairs you with a dedicated agent who knows the streets you are shopping.
              From first search to final signature, we handle the details — you make the move.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/properties">Explore listings <Icon name="arrow" size={16} /></Link>
              <Link className="btn btn--outline-light" to="/contact">Free valuation</Link>
            </div>
          </div>
        </div>
      </section>

      <SearchBar cities={cities} types={types} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Featured listings" title="Homes our agents are proud to show" text="A rotating selection of properties with the strongest value in each market.">
            <Link className="btn btn--ghost btn--sm" to="/properties">View all properties <Icon name="arrow" size={14} /></Link>
          </SectionHead>
          {featured.length === 0
            ? <div className="grid grid--3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 380 }} />)}</div>
            : <div className="grid grid--3">{featured.map((p) => <PropertyCard key={p.id} property={p} />)}</div>}
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="stats">
            {[
              { n: stats?.soldVolume ? `$${(stats.soldVolume / 1e6).toFixed(0)}M` : '$420M', l: 'Property sold' },
              { n: stats?.clients || '1,240', l: 'Happy clients' },
              { n: stats?.listings || '48', l: 'Active listings' },
              { n: stats?.cities || '8', l: 'Markets covered' },
            ].map((s) => (
              <div key={s.l}>
                <div className="stat__num">{s.n}</div>
                <div className="stat__label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How it works" title="Three steps, zero guesswork" center />
          <div className="grid grid--3">
            {STEPS.map((s) => (
              <div className="card feature" key={s.n}>
                <div className="feature__icon"><Icon name="check" size={24} /></div>
                <span className="eyebrow" style={{ marginBottom: 6 }}>Step {s.n}</span>
                <h3>{s.t}</h3>
                <p className="muted" style={{ margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow="What we do" title="Everything around the property, handled" text="Sales, management, finance and relocation under one roof — so nothing falls between vendors." />
          <div className="grid grid--3">
            {services.map((s) => (
              <Link className="card feature" to="/services" key={s.id}>
                <div className="feature__icon"><Icon name={s.icon} size={24} /></div>
                <h3>{s.title}</h3>
                <p className="muted" style={{ margin: 0 }}>{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="testimonials">
        <div className="container">
          <SectionHead eyebrow="Client stories" title="Rated 4.9 out of 5 by our clients" center />
          <div className="grid grid--3">
            {testimonials.map((t) => (
              <div className="card testimonial" key={t.id}>
                <div className="stars">{'★'.repeat(t.rating)}</div>
                <p>“{t.text}”</p>
                <div className="testimonial__who">
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.85rem' }}>{t.property} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand /></div>
      </section>
    </>
  );
}