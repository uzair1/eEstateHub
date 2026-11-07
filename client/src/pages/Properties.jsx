import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PageHero, EmptyState } from '../components/Layout';
import { api } from '../lib/api';
import { formatNumber } from '../lib/format';

const SORTS = [
  { v: 'newest', l: 'Newest first' },
  { v: 'price-asc', l: 'Price: low to high' },
  { v: 'price-desc', l: 'Price: high to low' },
  { v: 'sqft-desc', l: 'Largest first' },
  { v: 'beds-desc', l: 'Most bedrooms' },
  { v: 'popular', l: 'Most viewed' },
];

const DEFAULTS = { q: '', city: '', type: '', status: '', beds: '', baths: '', minPrice: '', maxPrice: '', minSqft: '', amenity: '', featured: '', sort: 'newest', page: '1' };

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ cities: [], types: [], amenities: [] });
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => ({ ...DEFAULTS, ...Object.fromEntries(searchParams) }), [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.properties(query);
      setData(res);
      setFilters(res.filters);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const set = (patch) => {
    const next = { ...query, ...patch };
    if (!('page' in patch)) next.page = '1';
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => setSearchParams({}, { replace: true });
  const activeCount = Object.entries(query).filter(([k, v]) => v && k !== 'sort' && k !== 'page').length;
  const { pagination } = data || {};

  return (
    <>
      <PageHero title="Properties" subtitle="Filter by city, type, budget and features — every listing includes a full cost breakdown and the agent who knows it best.">
        <p className="breadcrumb"><a href="/">Home</a> / Properties</p>
      </PageHero>

      <section className="section">
        <div className="container layout-listing">
          <aside className="card filters">
            <h3>Filters {activeCount > 0 && <span className="badge badge--gold">{activeCount}</span>}</h3>
            <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 18 }}>Narrow down what you see.</p>

            <div className="filter-row">
              <label htmlFor="f-q">Keyword</label>
              <input id="f-q" className="input" placeholder="Search…" value={query.q} onChange={(e) => set({ q: e.target.value })} />
            </div>

            <div className="filter-row">
              <label htmlFor="f-city">City</label>
              <select id="f-city" className="select" value={query.city} onChange={(e) => set({ city: e.target.value })}>
                <option value="">All cities</option>
                {filters.cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-row">
              <label htmlFor="f-type">Property type</label>
              <select id="f-type" className="select" value={query.type} onChange={(e) => set({ type: e.target.value })}>
                <option value="">All types</option>
                {filters.types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="filter-row">
              <label htmlFor="f-status">Status</label>
              <select id="f-status" className="select" value={query.status} onChange={(e) => set({ status: e.target.value })}>
                <option value="">Any status</option>
                {['For Sale', 'For Rent', 'Sold'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-row">
              <label>Price range (USD)</label>
              <div className="range-pair">
                <input className="input" type="number" min="0" placeholder="Min" value={query.minPrice} onChange={(e) => set({ minPrice: e.target.value })} />
                <input className="input" type="number" min="0" placeholder="Max" value={query.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })} />
              </div>
            </div>

            <div className="filter-row">
              <label htmlFor="f-beds">Bedrooms</label>
              <select id="f-beds" className="select" value={query.beds} onChange={(e) => set({ beds: e.target.value })}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            <div className="filter-row">
              <label htmlFor="f-baths">Bathrooms</label>
              <select id="f-baths" className="select" value={query.baths} onChange={(e) => set({ baths: e.target.value })}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            <div className="filter-row">
              <label htmlFor="f-sqft">Minimum size (ft&sup2;)</label>
              <input id="f-sqft" className="input" type="number" min="0" step="100" placeholder="e.g. 1500" value={query.minSqft} onChange={(e) => set({ minSqft: e.target.value })} />
            </div>

            <div className="filter-row">
              <label htmlFor="f-amenity">Amenity</label>
              <select id="f-amenity" className="select" value={query.amenity} onChange={(e) => set({ amenity: e.target.value })}>
                <option value="">Any amenity</option>
                {filters.amenities.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <label className="check" style={{ marginBottom: 18 }}>
              <input type="checkbox" checked={query.featured === 'true'} onChange={(e) => set({ featured: e.target.checked ? 'true' : '' })} />
              Featured listings only
            </label>

            <button className="btn btn--ghost btn--block btn--sm" onClick={clearAll}>Reset all filters</button>
          </aside>

          <div>
            <div className="listing-toolbar">
              <div>
                <strong style={{ color: 'var(--ink)' }}>{formatNumber(pagination?.total || 0)}</strong> properties found
                {activeCount > 0 && <span className="muted"> · {activeCount} filter{activeCount > 1 ? 's' : ''} applied</span>}
              </div>
              <select className="select" style={{ width: 'auto', padding: '9px 12px', fontSize: '0.9rem' }} value={query.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort results">
                {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
            {loading && <div className="grid grid--3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 380 }} />)}</div>}

            {!loading && data?.data.length === 0 && (
              <EmptyState
                title="No properties match those filters"
                text="Try widening your price range or clearing the amenity filter — new listings are added every day."
                action={{ to: '/contact', label: 'Tell us what you want' }}
              />
            )}

            {!loading && data?.data.length > 0 && (
              <div className="grid grid--3">{data.data.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
            )}

            {pagination && pagination.pages > 1 && (
              <nav className="pagination" aria-label="Pagination">
                <button onClick={() => set({ page: String(pagination.page - 1) })} disabled={pagination.page <= 1}>Prev</button>
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => set({ page: String(i + 1) })}>{i + 1}</button>
                ))}
                <button onClick={() => set({ page: String(pagination.page + 1) })} disabled={pagination.page >= pagination.pages}>Next</button>
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}