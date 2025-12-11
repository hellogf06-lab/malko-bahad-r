import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🔐 ProtectedRoute Check:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user found - Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ User authenticated - Rendering app');
  return <>{children}</>;
};

export default ProtectedRoute;
