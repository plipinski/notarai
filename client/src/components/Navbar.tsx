import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import classNames from 'classnames';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={classNames(
        'px-3 py-2 rounded text-sm font-medium hover:bg-slate-100',
        location.pathname.startsWith(to) ? 'bg-slate-200' : ''
      )}
    >
      {label}
    </Link>
  );

  return (
    <nav className="flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="font-semibold text-lg">Notarai</div>
        {user && (
          <div className="flex items-center gap-2">
            {navLink('/chat', 'Chat')}
            {navLink('/files', 'Files')}
            {user.role === 'admin' && navLink('/admin/users', 'Admin')}
            {navLink('/profile', 'Profile')}
          </div>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user.email}</span>
          <button
            className="bg-slate-900 text-white px-3 py-2 rounded text-sm hover:bg-slate-800"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
