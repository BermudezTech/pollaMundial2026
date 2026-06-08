import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userUuid = localStorage.getItem('user_uuid');

  if (!userUuid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
