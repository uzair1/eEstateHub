import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { api } from '../lib/api';

const EXPLORE = ['Homes for sale', 'Apartments for rent', 'Open houses', 'New developments', 'Commercial', 'Land'];
const COMPANY = ['About us', 'Our agents', 'Services', 'Careers', 'Press', 'Testimonials'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ type: '', text: '' });

  const subscribe = async (e) => {
    e.preventDefault();
    setState({ type: '', text: '' });
    try {
      await api.subscribe(email);
      setState({ type: 'success', text: 'You are on the list — fresh listings land every Friday.' });
      setEmail('');
    } catch (err) {
      setState({ type: 'error', text: err.message });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="logo" style={{ color: '#fff', marginBottom: 16 }}>
              <span className="logo__mark"><Icon name="home" size={19} /></span>
              EstateHub
            </Link>
            <p style={{ maxWidth: 320 }}>
              A full-service real estate agency helping buyers, sellers and investors across eight
              metropolitan markets since 2009. Local expertise, national reach.
            </p>
            <div className="socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="facebook" size={17} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Icon name="twitter" size={17} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" size={17} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={17} /></a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>{EXPLORE.map((l) => <li key={l}><Link to="/properties">{l}</Link></li>)}</ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>{COMPANY.map((l) => <li key={l}><Link to={l === 'About us' ? '/about' : l === 'Our agents' ? '/agents' : l === 'Testimonials' ? '/#testimonials' : '/services'}>{l}</Link></li>)}</ul>
          </div>

          <div>
            <h4>Weekly digest</h4>
            <p style={{ fontSize: '0.92rem' }}>New listings, price drops and market insight — no spam, unsubscribe anytime.</p>
            <form className="newsletter-form" onSubmit={subscribe}>
              <input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
              <button className="btn btn--primary btn--sm" type="submit">Join</button>
            </form>
            {state.text && (
              <p style={{ fontSize: '0.85rem', marginTop: 10, color: state.type === 'success' ? '#7dd3a8' : '#f0938b' }}>{state.text}</p>
            )}
            <ul style={{ marginTop: 26 }}>
              <li><a href="tel:+14155550100"><Icon name="phone" size={14} /> +1 (415) 555-0100</a></li>
              <li><a href="mailto:hello@estatehub.com"><Icon name="mail" size={14} /> hello@estatehub.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} EstateHub Realty. All rights reserved.</span>
          <span>CA DRE #02154880 · Equal Housing Opportunity</span>
        </div>
      </div>
    </footer>
  );
}