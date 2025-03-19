import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function AdminHome() {
  const { user, signOut, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalHairdressers: 0,
    pendingApprovals: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch admin dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This would be implemented to fetch real data
        // For now, we'll use sample data
        setStats({
          totalClients: 42,
          totalHairdressers: 18,
          pendingApprovals: 5,
          recentTransactions: [
            {
              id: 1,
              type: 'registration',
              amount: 1500,
              date: '2023-07-10T14:30:00',
              userName: 'Sophie Kengne'
            },
            {
              id: 2,
              type: 'appointment',
              amount: 5000,
              date: '2023-07-11T10:15:00',
              userName: 'Jean Mbongo'
            },
            {
              id: 3,
              type: 'registration',
              amount: 1500,
              date: '2023-07-11T16:45:00',
              userName: 'Marie Dupont'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        Sentry.captureException(error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <h1 className="text-xl font-bold text-indigo-900">Salon App Admin</h1>
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
            <h2 className="text-2xl font-bold text-indigo-900 mb-1">Admin Dashboard</h2>
            <p className="text-gray-600">Overview of system statistics and management</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="loader">
                <div></div>
                <div className="animation-delay-100"></div>
                <div className="animation-delay-200"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-6">
              <p className="text-red-500">{error}</p>
              <button 
                className="btn-primary mt-4 text-sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 mr-4">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Hairdressers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalHairdressers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 mr-4">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-indigo-800">Quick Actions</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/admin/users" className="btn-primary flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Manage Users
                  </Link>
                  
                  <Link to="/admin/transactions" className="btn-primary flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Transactions
                  </Link>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-indigo-800">Recent Transactions</h3>
                  <Link to="/admin/transactions" className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All
                  </Link>
                </div>
                
                <div className="p-4">
                  {stats.recentTransactions.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No recent transactions found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stats.recentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.type === 'registration'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {transaction.type === 'registration' ? 'Registration' : 'Appointment'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.userName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.amount} FCFA
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(transaction.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
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