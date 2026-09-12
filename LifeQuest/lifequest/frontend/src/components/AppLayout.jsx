import { useState } from 'react';
import Sidebar from './Sidebar';
import ToastStack from './ToastStack';
import LevelUpModal from './LevelUpModal';

export default function AppLayout({ children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <button
        className="mobile-nav-toggle"
        onClick={() => setNavOpen((v) => !v)}
        aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
      >
        {navOpen ? '✕' : '☰'}
      </button>
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="main-column">
        <div className="page">{children}</div>
      </div>
      <ToastStack />
      <LevelUpModal />
    </div>
  );
}
