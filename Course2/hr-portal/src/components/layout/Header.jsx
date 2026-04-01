import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuToggle }) {
  const { user, isHR } = useAuth();

  return (
    <header className="app-header">
      <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="header-title">
        <h2>{isHR ? 'HR Management' : 'Employee Portal'}</h2>
      </div>

      <div className="header-right">
        <span className="header-greeting" data-testid="header-greeting">
          Hello, {user?.firstName}
        </span>
        <span className={`role-badge role-${user?.role}`}>
          {isHR ? 'HR' : 'Employee'}
        </span>
      </div>
    </header>
  );
}
