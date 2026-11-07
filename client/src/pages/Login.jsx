import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login({ email: form.email, password: form.password });
      else await register(form);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container auth-wrap">
      <div className="card auth-card">
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button>
        </div>

        <h1>{mode === 'login' ? 'Welcome back' : 'Join EstateHub'}</h1>
        <p className="muted">
          {mode === 'login'
            ? 'Sign in to save properties and track your viewings.'
            : 'Create an account to save listings and contact agents directly.'}
        </p>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="a-name">Full name</label>
              <input id="a-name" className="input" required minLength={2} value={form.name} onChange={update('name')} />
            </div>
          )}
          <div className="field">
            <label htmlFor="a-email">Email</label>
            <input id="a-email" type="email" className="input" required value={form.email} onChange={update('email')} />
          </div>
          <div className="field">
            <label htmlFor="a-pass">Password</label>
            <input id="a-pass" type="password" className="input" required minLength={6} value={form.password} onChange={update('password')} placeholder="At least 6 characters" />
          </div>
          <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
            {busy ? <><span className="spinner" /> Please wait…</> : <><Icon name="key" size={16} /> {mode === 'login' ? 'Sign in' : 'Create account'}</>}
          </button>
        </form>

        {mode === 'login' && (
          <div className="alert alert--success" style={{ marginTop: 20, marginBottom: 0 }}>
            Demo accounts — admin: <strong>admin@estatehub.com</strong> / password · user: <strong>demo@estatehub.com</strong> / password
          </div>
        )}

        <p className="auth-alt">
          <Link to="/properties" style={{ color: 'var(--gold-500)', fontWeight: 600 }}>Browse listings without an account</Link>
        </p>
      </div>
    </div>
  );
}