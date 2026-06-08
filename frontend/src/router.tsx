import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Fases from './views/Fases';
import Reglas from './views/Reglas';
import AdminMatches from './views/AdminMatches';
import ProtectedRoute from './App';
import ChangePassword from './views/ChangePassword';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'change-password',
        element: <ChangePassword />,
      },
      {
        path: '',
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'fases',
            element: <Fases />,
          },
          {
            path: 'reglas',
            element: <Reglas />,
          },
          {
            path: 'admin-matches',
            element: <AdminMatches />,
          },
          {
            path: '',
            element: <Dashboard />, // Redirect to dashboard by default
          }
        ],
      }
    ],
  },
]);
