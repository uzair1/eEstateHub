import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/agents', label: 'Agents' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header({ dark = false }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`header${dark ? ' header--dark' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="logo">
          <span className="logo__mark"><Icon name="home" size={19} /></span>
          EstateHub
        </Link>

        <nav className={`nav${open ? ' open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>Admin</NavLink>
          )}
        </nav>

        <div className="header__actions">
          <button className="icon-btn" onClick={() => navigate('/favorites')} aria-label="Saved properties" title="Saved properties">
            <Icon name="heart" size={18} />
            {count > 0 && <span className="icon-btn__dot">{count}</span>}
          </button>

          {user ? (
            <>
              <span className="nav__link" style={{ cursor: 'default' }}>{user.name.split(' ')[0]}</span>
              <button className={`btn btn--sm ${dark ? 'btn--outline-light' : 'btn--ghost'}`} onClick={logout}>
                <Icon name="logout" size={15} /> Logout
              </button>
            </>
          ) : (
            <Link className={`btn btn--sm ${dark ? 'btn--primary' : 'btn--dark'}`} to="/login">Sign in</Link>
          )}

          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}