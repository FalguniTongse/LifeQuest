import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
