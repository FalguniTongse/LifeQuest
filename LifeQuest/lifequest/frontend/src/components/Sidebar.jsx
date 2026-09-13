import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAudioEnabled, setAudioEnabled, playClick } from '../utils/sounds';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/quests', label: 'Quests', icon: '✎' },
  { to: '/character', label: 'Character', icon: '☗' },
  { to: '/shop', label: 'Shop', icon: '⚕' },
  { to: '/inventory', label: 'Inventory', icon: '▤' },
  { to: '/achievements', label: 'Achievements', icon: '✦' },
];

export default function Sidebar({ open, onNavigate }) {
  const { user, logout } = useAuth();
  const [audioOn, setAudioOn] = useState(isAudioEnabled());

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioEnabled(next);
    setAudioOn(next);
    if (next) playClick();
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <div className="mark">Life<span>Quest</span></div>
        <div className="sub">Level up your real life</div>
      </div>
      <nav className="sidebar-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="audio-control">
          <span>Web-shooter SFX</span>
          <button
            type="button"
            className="audio-toggle"
            role="switch"
            aria-checked={audioOn}
            aria-label="Toggle sound effects"
            onClick={toggleAudio}
          />
        </div>
        <div className="sidebar-user">
          <strong>{user?.username}</strong>
          {user?.email}
        </div>
        <button className="btn btn-outline btn-block btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
