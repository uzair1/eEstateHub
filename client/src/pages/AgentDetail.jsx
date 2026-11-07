import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import PropertyCard from '../components/PropertyCard';
import { SectionHead, EmptyState, CtaBand } from '../components/Layout';
import { api } from '../lib/api';

export default function AgentDetail() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.agent(id).then((r) => setAgent(r.data)).catch(() => setAgent(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section"><div className="container"><div className="skeleton" style={{ height: 380 }} /></div></div>;

  if (!agent) {
    return (
      <div className="section">
        <div className="container">
          <EmptyState icon="users" title="Agent not found" text="This profile may have been removed." action={{ to: '/agents', label: 'All agents' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <img className="avatar avatar--xl" src={agent.photo} alt={agent.name} style={{ border: 'none', width: 120, height: 120 }} />
            <div style={{ flex: 1, minWidth: 260 }}>
              <span className="eyebrow">{agent.role}</span>
              <h1 style={{ marginBottom: 6 }}>{agent.name}</h1>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: '#c6d0dc', fontSize: '0.92rem' }}>
                <span><Icon name="phone" size={14} /> {agent.phone}</span>
                <span><Icon name="mail" size={14} /> {agent.email}</span>
                <span><Icon name="star" size={14} fill="currentColor" style={{ color: 'var(--gold-500)' }} /> {agent.rating.toFixed(1)} ({agent.reviews} reviews)</span>
              </div>
            </div>
            <Link className="btn btn--primary" to="/contact">Contact {agent.name.split(' ')[0]}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            <div style={{ gridColumn: 'span 2' }}>
              <div className="card card--pad">
                <h3>About</h3>
                <p>{agent.bio}</p>
                <h3 style={{ marginTop: 26 }}>Specialties</h3>
                <div className="chip-row" style={{ marginBottom: 22 }}>
                  {agent.specialties.map((s) => <span className="chip" key={s} style={{ cursor: 'default' }}>{s}</span>)}
                </div>
                <h3>Languages</h3>
                <div className="chip-row">
                  {agent.languages.map((l) => <span className="chip" key={l} style={{ cursor: 'default' }}><Icon name="chat" size={14} /> {l}</span>)}
                </div>
              </div>

              <div className="card card--pad" style={{ marginTop: 26 }}>
                <h3>Track record</h3>
                <div className="stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div><div className="stat__num">{agent.listings}</div><div className="stat__label">Listings sold</div></div>
                  <div><div className="stat__num">{agent.reviews}</div><div className="stat__label">Client reviews</div></div>
                  <div><div className="stat__num">{agent.rating.toFixed(1)}</div><div className="stat__label">Avg rating</div></div>
                </div>
              </div>
            </div>

            <aside>
              <div className="card card--pad">
                <h3>At a glance</h3>
                <div className="info-row">
                  <span className="info-row__icon"><Icon name="pin" size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Licence</div>
                    <div style={{ fontSize: '0.88rem' }}>CA DRE #0215488{agent.id.slice(-1)}</div>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-row__icon"><Icon name="clock" size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Response time</div>
                    <div style={{ fontSize: '0.88rem' }}>Usually within 2 hours</div>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-row__icon"><Icon name="home" size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Active listings</div>
                    <div style={{ fontSize: '0.88rem' }}>{agent.activeListings} homes</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow="Listings" title={`Homes represented by ${agent.name.split(' ')[0]}`} />
          {agent.listings.length === 0
            ? <EmptyState title="No active listings" text="Check back soon — new properties are added weekly." action={{ to: '/properties', label: 'Browse all properties' }} />
            : <div className="grid grid--3">{agent.listings.slice(0, 6).map((p) => <PropertyCard key={p.id} property={{ ...p, agent: { id: agent.id, name: agent.name, role: agent.role, photo: agent.photo } }} />)}</div>}
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand /></div>
      </section>
    </>
  );
}