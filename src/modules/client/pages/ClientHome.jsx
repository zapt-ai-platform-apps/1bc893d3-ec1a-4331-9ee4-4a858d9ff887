import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import HairstyleCatalog from '../components/HairstyleCatalog';

export default function ClientHome() {
  const { user, signOut, userProfile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
              alt="Logo" 
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-xl font-bold text-indigo-900">Salon App</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-right">
              <p className="text-sm font-medium text-indigo-700">
                {userProfile?.firstName} {userProfile?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <div className="relative">
              <button 
                className="btn-secondary text-sm"
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-1">Welcome, {userProfile?.firstName}!</h2>
            <p className="text-gray-600">Find and book your next hairstyle</p>
          </div>
          
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-indigo-800">Hairstyle Catalog</h3>
            </div>
            
            <div>
              <Routes>
                <Route path="/" element={<HairstyleCatalog />} />
                {/* Add more client routes as needed */}
              </Routes>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Salon App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}