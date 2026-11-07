import { Link } from 'react-router-dom';
import Icon from './Icon';

export function SectionHead({ eyebrow, title, text, center = false, children }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p className="lead">{text}</p>}
      {children}
    </div>
  );
}

export function CtaBand({
  title = 'Ready to find your forever home?',
  text = 'Book a free consultation and let our agents build a shortlist around your budget, timeline and lifestyle.',
  primary = { to: '/contact', label: 'Book a consultation' },
  secondary = { to: '/properties', label: 'Browse listings' },
}) {
  return (
    <div className="cta-band">
      <div style={{ maxWidth: 620 }}>
        <h2>{title}</h2>
        <p style={{ color: '#c6d0dc', margin: 0 }}>{text}</p>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn btn--primary" to={primary.to}>{primary.label}</Link>
        {secondary && <Link className="btn btn--outline-light" to={secondary.to}>{secondary.label}</Link>}
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'search', title, text, action }) {
  return (
    <div className="empty card card--pad">
      <div className="empty__icon"><Icon name={icon} size={44} stroke="var(--muted)" /></div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action && <Link className="btn btn--dark" to={action.to}>{action.label}</Link>}
    </div>
  );
}

export function PageHero({ title, subtitle, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p style={{ margin: 0, maxWidth: 640 }}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}