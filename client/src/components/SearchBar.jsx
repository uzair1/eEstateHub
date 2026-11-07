import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const TABS = [
  { key: 'For Sale', label: 'Buy' },
  { key: 'For Rent', label: 'Rent' },
  { key: '', label: 'Any status' },
];

export default function SearchBar({ cities = [], types = [] }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('For Sale');
  const [form, setForm] = useState({ q: '', city: '', type: '', beds: '' });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries({ ...form, status }).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="searchbar">
      <div className="container">
        <form className="searchbar__panel" onSubmit={submit}>
          <div className="searchbar__tabs">
            {TABS.map((t) => (
              <button key={t.label} type="button" className={`tab${status === t.key ? ' active' : ''}`} onClick={() => setStatus(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="searchbar__row">
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="sb-q">Location or keyword</label>
              <input id="sb-q" className="input" placeholder="City, neighbourhood, address…" value={form.q} onChange={update('q')} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="sb-city">City</label>
              <select id="sb-city" className="select" value={form.city} onChange={update('city')}>
                <option value="">Any city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="sb-type">Type</label>
              <select id="sb-type" className="select" value={form.type} onChange={update('type')}>
                <option value="">Any type</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="sb-beds">Beds</label>
              <select id="sb-beds" className="select" value={form.beds} onChange={update('beds')}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <button className="btn btn--primary" type="submit"><Icon name="search" size={17} /> Search</button>
          </div>
        </form>
      </div>
    </div>
  );
}