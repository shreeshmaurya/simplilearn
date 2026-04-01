import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isHR, logout } = useAuth();

  const hrLinks = [
    { to: '/hr/dashboard', label: 'Dashboard', icon: 'grid' },
    { to: '/hr/employees', label: 'Employees', icon: 'users' },
    { to: '/hr/leave-management', label: 'Leave Management', icon: 'calendar' },
  ];

  const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard', icon: 'grid' },
    { to: '/employee/profile', label: 'My Profile', icon: 'user' },
    { to: '/employee/leave', label: 'Leave Requests', icon: 'calendar' },
  ];

  const links = isHR ? hrLinks : employeeLinks;

  const iconMap = {
    grid: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="logo-icon logo-sm">HR</span>
          <span className="brand-text">HR Portal</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={onClose}
            >
              {iconMap[link.icon]}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <div className="user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">{isHR ? 'HR Manager' : 'Employee'}</span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm btn-full" onClick={logout} data-testid="logout-btn">
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
