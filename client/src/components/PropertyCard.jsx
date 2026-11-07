import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice, formatNumber, statusClass, timeAgo } from '../lib/format';

export default function PropertyCard({ property }) {
  const { has, toggle } = useFavorites();
  const saved = has(property.id);

  return (
    <article className="card prop-card">
      <Link to={`/properties/${property.slug || property.id}`} className="prop-card__media">
        <img src={property.images[0]} alt={property.title} loading="lazy" />
        <div className="prop-card__badges">
          <span className={`badge badge--${statusClass(property.status)}`}>{property.status}</span>
          {property.featured && <span className="badge badge--featured">Featured</span>}
        </div>
        <div className="prop-card__price">{formatPrice(property.price, property.status)}</div>
      </Link>

      <button
        type="button"
        className={`prop-card__fav${saved ? ' active' : ''}`}
        onClick={(e) => { e.preventDefault(); toggle(property.id); }}
        aria-label={saved ? 'Remove from saved' : 'Save property'}
      >
        <Icon name="heart" size={17} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className="prop-card__body">
        <div>
          <h3 className="prop-card__title">
            <Link to={`/properties/${property.slug || property.id}`}>{property.title}</Link>
          </h3>
          <p className="prop-card__loc"><Icon name="pin" size={13} /> {property.address}, {property.city}, {property.state}</p>
        </div>

        <div className="prop-meta">
          <span><Icon name="bed" size={15} /> {property.beds} Beds</span>
          <span><Icon name="bath" size={15} /> {property.baths} Baths</span>
          <span><Icon name="area" size={15} /> {formatNumber(property.sqft)} ft&sup2;</span>
        </div>

        <div className="prop-card__foot">
          {property.agent && (
            <>
              <img className="avatar" src={property.agent.photo} alt={property.agent.name} loading="lazy" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{property.agent.name}</div>
                <div style={{ fontSize: '0.8rem' }}>{timeAgo(property.listedAt)}</div>
              </div>
            </>
          )}
          <Link to={`/properties/${property.slug || property.id}`} className="btn btn--ghost btn--sm" style={{ marginLeft: 'auto' }}>
            View <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}