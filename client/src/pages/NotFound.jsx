import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container notfound">
      <h1>404</h1>
      <h2>We couldn't find that page</h2>
      <p className="muted">The listing may have sold, or the link is out of date. Try one of these instead.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link className="btn btn--primary" to="/properties">Browse properties</Link>
        <Link className="btn btn--ghost" to="/contact">Contact an agent</Link>
      </div>
    </div>
  );
}