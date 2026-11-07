import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero, SectionHead, CtaBand } from '../components/Layout';
import { api } from '../lib/api';

export default function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => { api.agents().then((r) => setAgents(r.data)).catch(() => {}); }, []);

  return (
    <>
      <PageHero title="Meet the team" subtitle="Licensed agents, negotiators and property managers who work the neighbourhoods they live in.">
        <p className="breadcrumb"><Link to="/">Home</Link> / Agents</p>
      </PageHero>

      <section className="section">
        <div className="container">
          {agents.length === 0
            ? <div className="grid grid--4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 400 }} />)}</div>
            : (
              <div className="grid grid--4">
                {agents.map((a) => (
                  <article className="card agent-card" key={a.id}>
                    <div className="agent-card__top">
                      <img className="avatar avatar--xl" style={{ margin: '0 auto 16px' }} src={a.photo} alt={a.name} />
                      <h3 style={{ marginBottom: 2 }}>{a.name}</h3>
                      <p className="agent-card__role">{a.role}</p>
                    </div>
                    <div className="agent-card__body">
                      <div className="rating" style={{ justifyContent: 'center', marginBottom: 12 }}>
                        <Icon name="star" size={15} fill="currentColor" style={{ color: 'var(--gold-500)' }} />
                        {a.rating.toFixed(1)} <span className="muted" style={{ fontWeight: 400 }}>({a.reviews} reviews)</span>
                      </div>
                      <div className="chip-row" style={{ justifyContent: 'center', marginBottom: 14 }}>
                        {a.specialties.map((s) => <span className="chip" key={s} style={{ cursor: 'default' }}>{s}</span>)}
                      </div>
                      <p className="muted" style={{ fontSize: '0.9rem' }}>{a.bio}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--muted)', marginBottom: 16 }}>
                        <span><strong style={{ color: 'var(--ink)' }}>{a.activeListings}</strong> active listings</span>
                        <span><strong style={{ color: 'var(--ink)' }}>{a.languages.length}</strong> languages</span>
                      </div>
                      <Link className="btn btn--dark btn--block btn--sm" to={`/agents/${a.id}`}>View profile <Icon name="arrow" size={14} /></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow="Why work with us" title="Support that makes you better" />
          <div className="grid grid--4">
            {[
              { i: 'chart', t: 'Shared pipeline', d: 'Every lead and every listing lives in one system — no missed follow-ups, no duplicated calls.' },
              { i: 'shield', t: 'Compliance covered', d: 'Fair Housing, disclosure and paperwork handled centrally so you focus on clients.' },
              { i: 'gauge', t: 'Marketing budget', d: 'A 30-day plan for every listing, funded centrally with photography and video.' },
              { i: 'award', t: '70/30 split', d: 'One of the strongest commission splits in the region, paid out weekly.' },
            ].map((b) => (
              <div className="card feature" key={b.t}>
                <div className="feature__icon"><Icon name={b.i} size={24} /></div>
                <h3>{b.t}</h3>
                <p className="muted" style={{ margin: 0 }}>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand title="Interested in joining the team?" text="We hire licensed agents and buy-side specialists every quarter. Send us your licence details." primary={{ to: '/contact', label: 'Apply now' }} secondary={null} /></div>
      </section>
    </>
  );
}