import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import SplashScreen from '@/modules/core/components/SplashScreen';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegistrationPage from '@/modules/auth/pages/RegistrationPage';
import ClientHome from '@/modules/client/pages/ClientHome';
import HairdresserHome from '@/modules/hairdresser/pages/HairdresserHome';
import AdminHome from '@/modules/admin/pages/AdminHome';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import ZaptBadge from '@/modules/core/components/ZaptBadge';
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage';
import HairdresserRegistrationFlow from '@/modules/hairdresser/pages/HairdresserRegistrationFlow';
import ClientRegistrationFlow from '@/modules/client/pages/ClientRegistrationFlow';
import UserManagement from '@/modules/admin/pages/UserManagement';
import TransactionHistory from '@/modules/admin/pages/TransactionHistory';

export default function App() {
  const { user, loading, userType } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 3-5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">
          <div></div>
          <div className="animation-delay-100"></div>
          <div className="animation-delay-200"></div>
        </div>
      </div>
    );
  }

  // Helper function to redirect based on user type
  const redirectToDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    
    if (userType === 'admin') return <Navigate to="/admin" />;
    if (userType === 'hairdresser') return <Navigate to="/hairdresser" />;
    return <Navigate to="/client" />;
  };

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <LoginPage /> : redirectToDashboard()} />
        <Route path="/register" element={!user ? <RegistrationPage /> : redirectToDashboard()} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Registration flows */}
        <Route 
          path="/register/hairdresser/*" 
          element={
            <ProtectedRoute>
              <HairdresserRegistrationFlow />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register/client/*" 
          element={
            <ProtectedRoute>
              <ClientRegistrationFlow />
            </ProtectedRoute>
          } 
        />
        
        {/* Client routes */}
        <Route 
          path="/client/*" 
          element={
            <ProtectedRoute allowedTypes={['client']}>
              <ClientHome />
            </ProtectedRoute>
          } 
        />
        
        {/* Hairdresser routes */}
        <Route 
          path="/hairdresser/*" 
          element={
            <ProtectedRoute allowedTypes={['hairdresser']}>
              <HairdresserHome />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/transactions" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <TransactionHistory />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={redirectToDashboard()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ZaptBadge />
    </div>
  );
}