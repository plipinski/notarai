import React from 'react';
import { useAuth } from '../providers/AuthProvider';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4 space-y-2">
        <div className="text-sm text-slate-500">User ID</div>
        <div className="font-mono text-sm">{user._id}</div>
        <div className="text-sm text-slate-500">Email</div>
        <div>{user.email}</div>
        <div className="text-sm text-slate-500">Role</div>
        <div className="capitalize">{user.role}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
