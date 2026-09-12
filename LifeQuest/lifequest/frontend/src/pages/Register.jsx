import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = await register(username, email, password, confirmPassword);
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
          <h2>Create your character</h2>
          <p className="sub">Every real goal you log from here on out counts toward something.</p>
          {error && <div className="form-error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Creating your character…' : 'Create character'}
            </button>
          </form>
        </div>
        <div className="auth-switch">
          Already adventuring? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
