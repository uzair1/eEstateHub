import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero, SectionHead, CtaBand } from '../components/Layout';
import { api } from '../lib/api';

const PROCESS = [
  { n: '01', t: 'Discovery call', d: 'A 20-minute call to understand budget, timeline, financing and the trade-offs you are willing to make.' },
  { n: '02', t: 'Strategy & shortlist', d: 'You receive a written buyer strategy plus 5–8 hand-picked homes, including off-market options.' },
  { n: '03', t: 'Tours & feedback', d: 'We schedule viewings back to back and update the shortlist after every reaction you have.' },
  { n: '04', t: 'Offer & escrow', d: 'Negotiation strategy, offer drafting, escrow coordination, inspection and appraisal management.' },
  { n: '05', t: 'Close & aftercare', d: 'Final walkthrough, key handover and a 12-month check-in plus referral rewards.' },
];

const FAQ = [
  { q: 'Do you charge buyers a fee?', a: 'No. Our buyer-side representation, including negotiation and escrow coordination, is free. We are paid by the seller on a successful sale, which is disclosed in writing up front.' },
  { q: 'How quickly can I get pre-approved?', a: 'Our in-house lending desk can issue a pre-approval letter within 24 hours once documents are submitted.' },
  { q: 'Do you work with remote buyers?', a: 'Yes — roughly a third of our clients buy from another state or country. We use recorded walkthroughs, live video tours and notarised remote signing.' },
  { q: 'What is your minimum service fee?', a: 'There is no minimum. Management and advisory engagements are quoted per property after a free consultation.' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => { api.services().then((r) => setServices(r.data)).catch(() => {}); }, []);

  return (
    <>
      <PageHero title="Services" subtitle="Buying, selling, managing, financing and relocating — delivered by one team so nothing falls between vendors.">
        <p className="breadcrumb"><Link to="/">Home</Link> / Services</p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {services.map((s) => (
              <div className="card feature" key={s.id}>
                <div className="feature__icon"><Icon name={s.icon} size={24} /></div>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
                <Link className="btn btn--ghost btn--sm" to="/contact">Enquire <Icon name="arrow" size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <SectionHead eyebrow="Our process" title="How an engagement runs" text="The same five stages whether you are buying a $600k condo or a $6M estate."          />
          <div className="timeline">
            {PROCESS.map((p) => (
              <div className="timeline__item" key={p.n}>
                <div className="timeline__year">Step {p.n}</div>
                <h3 style={{ marginBottom: 6 }}>{p.t}</h3>
                <p className="muted" style={{ margin: 0 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2" style={{ gap: 40 }}>
            <div>
              <SectionHead eyebrow="FAQ" title="Questions we get asked most" />
              <p className="muted">Can’t find yours? <Link to="/contact" style={{ color: 'var(--gold-500)', fontWeight: 600 }}>Ask an agent directly.</Link></p>
            </div>
            <div className="card" style={{ padding: 8 }}>
              {FAQ.map((f, i) => (
                <div key={f.q} style={{ borderBottom: i === FAQ.length - 1 ? 'none' : '1px solid var(--line)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '18px 20px', font: 'inherit', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 12 }}
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <Icon name="arrow" size={16} style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
                  </button>
                  {openFaq === i && <p className="muted" style={{ padding: '0 20px 20px', margin: 0 }}>{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><CtaBand /></div>
      </section>
    </>
  );
}