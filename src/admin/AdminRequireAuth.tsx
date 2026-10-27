import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export function AdminRequireAuth() {
  const { isAuthed, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
