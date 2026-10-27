import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Users, Wrench, UserCheck, TrendingUp,
  Settings, Activity, BookOpen, MessageSquare, LogOut, ChevronLeft,
  LayoutDashboard, UserCog,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import './admin.css';

const NAV = [
  { to: '/admin/orders',          label: 'Orders',           icon: ShoppingBag },
  { to: '/admin/service-partners', label: 'Service Partners', icon: UserCheck },
  { to: '/admin/services',        label: 'Services',         icon: Wrench },
  { to: '/admin/customers',       label: 'Customers',        icon: Users },
  { to: '/admin/leads',           label: 'Leads',            icon: LayoutDashboard },
];

const NAV_SUPER = [
  { to: '/admin/sub-admins',      label: 'Sub Admins',       icon: UserCog },
  { to: '/admin/reports',         label: 'Reports',          icon: TrendingUp },
  { to: '/admin/settings',        label: 'Settings',         icon: Settings },
  { to: '/admin/activity',        label: 'Activity',         icon: Activity },
  { to: '/admin/blog',            label: 'Blog',             icon: BookOpen },
  { to: '/admin/inquiries',       label: 'Inquiries',        icon: MessageSquare },
];

function initials(name: string) {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          <div className="adm-brand">
            <img src="/images/logo_white.webp" alt="MV Cleaning" style={{ height: 30 }} />
            <span className="adm-brand-label">Admin Portal</span>
          </div>
          <button className="adm-collapse-btn" aria-label="Collapse sidebar">
            <ChevronLeft size={16} />
          </button>
        </div>

        <nav className="adm-nav">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="adm-nav-divider" />
          <p className="adm-nav-section-label">SUPER ADMIN</p>

          {NAV_SUPER.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="adm-sidebar-foot">
          <div className="adm-user-row">
            <div className="adm-avatar">{user ? initials(user.username) : 'A'}</div>
            <div className="adm-user-info">
              <span className="adm-user-name">{user?.username ?? 'Admin'}</span>
              <span className="adm-user-role">{user?.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}</span>
            </div>
            <button className="adm-logout-btn" onClick={handleLogout} aria-label="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="adm-content">
        <Outlet />
      </div>
    </div>
  );
}
