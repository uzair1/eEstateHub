import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero } from '../components/Layout';
import { api } from '../lib/api';

const SUBJECTS = ['Buying a home', 'Selling a home', 'Renting', 'Property management', 'Investment advice', 'Relocation', 'Mortgage / pre-approval', 'Something else'];

const OFFICES = [
  { city: 'San Francisco', line: '580 Market Street, Suite 900', phone: '+1 (415) 555-0100' },
  { city: 'Los Angeles', line: '1180 Wilshire Blvd, Floor 14', phone: '+1 (213) 555-0148' },
  { city: 'New York', line: '250 Park Avenue, 7th floor', phone: '+1 (212) 555-0177' },
];

const HOURS = [['Monday – Friday', '8:30 – 18:30'], ['Saturday', '9:00 – 16:00'], ['Sunday', 'By appointment'], ['Public holidays', 'Closed']];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    try {
      await api.sendMessage(form);
      setStatus({ type: 'success', text: 'Message received. An agent will be in touch within one business day.' });
      setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageHero title="Contact us" subtitle="Tell us what you are looking for and an agent who knows that market will respond — usually the same day.">
        <p className="breadcrumb"><Link to="/">Home</Link> / Contact</p>
      </PageHero>

      <section className="section">
        <div className="container contact-layout">
          <div className="card card--pad">
            <h2>Send us a message</h2>
            <p className="muted">Fields marked are required. We never share your details with third parties.</p>

            {status.text && <div className={`alert alert--${status.type}`}>{status.text}</div>}

            <form onSubmit={submit}>
              <div className="grid grid--2" style={{ gap: 16 }}>
                <div className="field">
                  <label htmlFor="c-name">Full name *</label>
                  <input id="c-name" className="input" required value={form.name} onChange={update('name')} />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email *</label>
                  <input id="c-email" type="email" className="input" required value={form.email} onChange={update('email')} />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Phone</label>
                  <input id="c-phone" className="input" value={form.phone} onChange={update('phone')} />
                </div>
                <div className="field">
                  <label htmlFor="c-subject">What is this about?</label>
                  <select id="c-subject" className="select" value={form.subject} onChange={update('subject')}>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-message">Message *</label>
                <textarea id="c-message" className="textarea" required minLength={10} value={form.message} onChange={update('message')} placeholder="Budget, preferred neighbourhoods, timeline…" />
              </div>
              <button className="btn btn--primary" type="submit"><Icon name="mail" size={16} /> Send message</button>
            </form>
          </div>
          <aside style={{ display: 'grid', gap: 20 }}>
            <div className="card card--pad">
              <h3>Head office</h3>
              <div className="info-row">
                <span className="info-row__icon"><Icon name="pin" size={18} /></span>
                <div><div style={{ color: 'var(--ink)', fontWeight: 600 }}>580 Market Street, Suite 900</div><div style={{ fontSize: '0.88rem' }}>San Francisco, CA 94104</div></div>
              </div>
              <div className="info-row">
                <span className="info-row__icon"><Icon name="phone" size={18} /></span>
                <div><a href="tel:+14155550100">+1 (415) 555-0100</a><div style={{ fontSize: '0.88rem' }}>Main line</div></div>
              </div>
              <div className="info-row">
                <span className="info-row__icon"><Icon name="mail" size={18} /></span>
                <div><a href="mailto:hello@estatehub.com">hello@estatehub.com</a><div style={{ fontSize: '0.88rem' }}>Replies within 1 business day</div></div>
              </div>
              <div className="info-row" style={{ borderBottom: 'none' }}>
                <span className="info-row__icon"><Icon name="clock" size={18} /></span>
                <div>
                  <table className="hours-table">
                    <tbody>{HOURS.map(([d, h]) => <tr key={d}><td>{d}</td><td>{h}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>

            {OFFICES.map((o) => (
              <div className="card card--pad" key={o.city}>
                <h3 style={{ marginBottom: 6 }}>{o.city}</h3>
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>{o.line}<br />{o.phone}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="map-frame">
            <iframe
              title="EstateHub head office location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4250%2C37.7720%2C-122.4050%2C37.7820&layer=mapnik"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}