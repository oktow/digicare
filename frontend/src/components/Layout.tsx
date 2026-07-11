import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ChangePasswordModal from './ChangePasswordModal';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', module: 'dashboard' },
  { path: '/komplain', label: 'Komplain', icon: '📝', module: 'komplain' },
  { path: '/insiden', label: 'Insiden', icon: '⚠️', module: 'insiden' },
];

const getInitials = (name: string) =>
  name.split(' ').map((s) => s[0]).join('').toUpperCase().slice(0, 2) || '?';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBlue = theme === 'blue';
  const isGreen = theme === 'green';
  const modules = user?.modules ?? [];
  const initials = getInitials(user?.full_name ?? '');

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => modules.length === 0 || modules.includes(item.module)),
    [modules]
  );

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <aside
        className={`flex flex-col border-r transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center p-3 border-b gap-2" style={{ borderColor: 'var(--sidebar-border)' }}>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate" style={{ color: isBlue ? '#93c5fd' : isGreen ? '#6ee7b7' : '#2563eb' }}>DIGI-CARE RS</h1>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className={`shrink-0 p-1.5 rounded-lg text-sm transition-colors hover:opacity-80 ${collapsed ? 'mx-auto' : ''}`}
            style={{ color: 'var(--nav-text)' }}
            title={collapsed ? 'Perluas' : 'Ciutkan'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className={`flex-1 p-2 space-y-1 ${collapsed ? 'overflow-hidden' : ''}`}>
          {visibleNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full rounded-lg text-sm font-medium transition-colors ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2.5 text-left'}`}
              style={{
                background: location.pathname === item.path ? 'var(--active-bg)' : 'transparent',
                color: location.pathname === item.path ? 'var(--active-text)' : 'var(--nav-text)',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) e.currentTarget.style.background = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) e.currentTarget.style.background = 'transparent';
              }}
              title={collapsed ? item.label : undefined}
            >
              <span className={collapsed ? 'flex justify-center text-lg' : 'mr-2'}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          ))}
          {(modules.length === 0 || modules.includes('users')) && (
            <button
              onClick={() => navigate('/users')}
              className={`w-full rounded-lg text-sm font-medium transition-colors ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2.5 text-left'}`}
              style={{
                background: location.pathname === '/users' ? 'var(--active-bg)' : 'transparent',
                color: location.pathname === '/users' ? 'var(--active-text)' : 'var(--nav-text)',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/users') e.currentTarget.style.background = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/users') e.currentTarget.style.background = 'transparent';
              }}
              title={collapsed ? 'User' : undefined}
            >
              <span className={collapsed ? 'flex justify-center text-lg' : 'mr-2'}>👥</span>
              {!collapsed && 'User'}
            </button>
          )}
        </nav>

        <div className="p-2 border-t space-y-1.5" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className={collapsed ? 'flex flex-col items-center gap-1' : 'flex gap-1.5'}>
            {(['light', 'dark', 'blue', 'green'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded text-xs font-medium transition-all border ${collapsed ? 'p-1.5 w-8' : 'flex-1 px-2 py-1.5'}`}
                style={{
                  background: theme === t ? 'var(--active-bg)' : 'transparent',
                  color: theme === t ? 'var(--active-text)' : 'var(--nav-text)',
                  borderColor: theme === t ? 'var(--active-bg)' : 'var(--border-color)',
                }}
                title={collapsed ? (t === 'light' ? 'Terang' : t === 'dark' ? 'Gelap' : t === 'blue' ? 'Biru' : 'Hijau') : undefined}
              >
                {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : t === 'blue' ? '💙' : '💚'}
              </button>
            ))}
          </div>

          {collapsed ? (
            <div className="flex flex-col items-center gap-1 pt-1" style={{ color: 'var(--nav-text)' }}>
              <button onClick={() => window.dispatchEvent(new CustomEvent('dashboard-refresh'))} className="text-sm hover:opacity-80" title="Refresh">🔄</button>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--active-bg)', color: 'var(--active-text)' }}
                title={user?.full_name ?? ''}
              >
                {initials}
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm truncate" style={{ color: 'var(--nav-text)' }}>
                {user?.full_name}
                <span className="block text-xs opacity-70 truncate">{user?.role}</span>
              </div>
              <button onClick={() => window.dispatchEvent(new CustomEvent('dashboard-refresh'))} className="w-full text-left text-sm hover:opacity-80" style={{ color: 'var(--nav-text)' }}>
                🔄 Refresh
              </button>
              <button onClick={() => setShowChangePassword(true)} className="w-full text-left text-sm hover:opacity-80" style={{ color: 'var(--nav-text)' }}>
                🔑 Ubah Password
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className={`w-full text-sm hover:opacity-80 ${collapsed ? 'text-center py-1.5' : 'text-left'}`}
            style={{ color: '#f87171' }}
            title={collapsed ? 'Logout' : undefined}
          >
            {collapsed ? '🚪' : '🚪 Logout'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </div>
  );
}