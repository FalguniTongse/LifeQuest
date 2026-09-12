import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-brand">
          <Link to="/" className="mark">Life<span>Quest</span></Link>
        </div>
        <div className="auth-panel">
          <h2>Welcome back</h2>
          <p className="sub">Log in to pick up your streak where you left it.</p>
          {error && <div className="form-error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>
        <div className="auth-switch">
          New to LifeQuest? <Link to="/register">Create your character</Link>
        </div>
      </div>
    </div>
  );
}
