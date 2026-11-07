import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero, SectionHead, CtaBand } from '../components/Layout';
import { api } from '../lib/api';

const VALUES = [
  { i: 'shield', t: 'Radical honesty', d: 'If a home is overpriced we say so, even when it costs us a listing. Referrals last 20 years, not 20 days.' },
  { i: 'users', t: 'One point of contact', d: 'You get a named agent, not a rotating call centre. Same person from first call to key handover.' },
  { i: 'gauge', t: 'Data before instinct', d: 'Pricing, timing and offers are modelled on closed sales in your street — not on what feels right.' },
  { i: 'award', t: 'Local, then global', d: 'Eight metro markets, and a relocation desk for buyers arriving from overseas or out of state.' },
];

const MILESTONES = [
  { y: '2009', t: 'Founded in San Francisco', d: 'Sarah Mitchell opens a two-person brokerage focused on residential sales in the Bay Area.' },
  { y: '2013', t: 'First $100M in volume', d: 'The team expands to Los Angeles and New York with a dedicated relocation desk.' },
  { y: '2017', t: 'Property management launched', d: 'Owners living abroad gain a service for rent collection, screening and maintenance.' },
  { y: '2020', t: 'Eight markets', d: 'Miami, Seattle, Austin and Denver open, taking the agency past 1,000 transactions.' },
  { y: '2024', t: 'In-house lending desk', d: 'Mortgage brokerage launches, comparing 40+ lenders for clients at no additional cost.' },
  { y: 'Today', t: '1,240 clients, 420M sold', d: 'Still independent, still owner-operated, still answering our own phones.' },
];

export default function About() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => { api.testimonials().then((r) => setTestimonials(r.data)).catch(() => {}); }, []);

  return (
    <>
      <PageHero title="About EstateHub" subtitle="An independent, owner-operated brokerage that measures success in repeat clients and referrals — not listing volume.">
        <p className="breadcrumb"><Link to="/">Home</Link> / About</p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="grid grid--2" style={{ gap: 44, alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Our story</span>
              <h2>Fifteen years of getting the details right</h2>
              <p>
                EstateHub began in 2009 with a simple frustration: agents who sold volume instead of
                outcomes. We built the opposite — a small senior team, a written process for every
                engagement, and pricing decisions backed by closed sales rather than optimism.
              </p>
              <p>
                Today we operate across eight metropolitan markets with specialists in luxury residential,
                commercial, investment and relocation. The firm remains privately owned, which means our agents
                answer their own clients’ calls and our clients keep the same agent for years.
              </p>
              <div className="chip-row" style={{ marginTop: 20 }}>
                {['Independent', 'Owner-operated', 'Licensed in 8 states', 'Equal Housing Opportunity'].map((b) => (
                  <span className="chip" key={b} style={{ cursor: 'default' }}><Icon name="check" size={14} /> {b}</span>
                ))}
              </div>
            </div>
            <div className="grid grid--2" style={{ gap: 16 }}>
              <img src="/images/office.jpg" alt="EstateHub agents reviewing a property" style={{ borderRadius: 14, height: 280, objectFit: 'cover' }} />
              <img src="/images/props/prop-7.jpg" alt="EstateHub office" style={{ borderRadius: 14, height: 280, objectFit: 'cover', marginTop: 30 }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="What we stand for" title="Four rules we do not bend" center />
          <div className="grid grid--4">
            {VALUES.map((v) => (
              <div key={v.t} style={{ textAlign: 'center' }}>
                <div className="feature__icon" style={{ margin: '0 auto 16px' }}><Icon name={v.i} size={24} /></div>
                <h3 style={{ fontSize: '1.08rem' }}>{v.t}</h3>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="grid grid--2" style={{ gap: 44 }}>
            <div>
              <SectionHead eyebrow="Milestones" title="How we grew" />
              <p className="muted">From a two-desk office to eight markets — always one market at a time.</p>
            </div>
            <div className="timeline">
              {MILESTONES.map((m) => (
                <div className="timeline__item" key={m.y}>
                  <div className="timeline__year">{m.y}</div>
                  <h3 style={{ marginBottom: 4, fontSize: '1.1rem' }}>{m.t}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: '0.94rem' }}>{m.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Client stories" title="What clients say about working with us" center />
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