import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface Props {
  children: React.ReactNode;
  role?: 'admin';
}

export const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/chat" replace />;

  return <>{children}</>;
};
