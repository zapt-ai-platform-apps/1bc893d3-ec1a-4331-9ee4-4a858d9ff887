import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function UserManagement() {
  const { session } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // This would be implemented to fetch real data
        // For now, we'll use sample data
        const sampleUsers = [
          {
            id: 1,
            name: 'Sophie Kengne',
            email: 'sophie.k@example.com',
            type: 'hairdresser',
            isApproved: true,
            registrationDate: '2023-06-15T10:30:00'
          },
          {
            id: 2,
            name: 'Jean Mbongo',
            email: 'jean.m@example.com',
            type: 'client',
            isApproved: true,
            registrationDate: '2023-06-20T14:45:00'
          },
          {
            id: 3,
            name: 'Marie Dupont',
            email: 'marie.d@example.com',
            type: 'hairdresser',
            isApproved: false,
            registrationDate: '2023-07-05T09:15:00'
          },
          {
            id: 4,
            name: 'Pierre Nkodo',
            email: 'pierre.n@example.com',
            type: 'client',
            isApproved: true,
            registrationDate: '2023-07-10T16:20:00'
          },
          {
            id: 5,
            name: 'Aminata Diallo',
            email: 'aminata.d@example.com',
            type: 'hairdresser',
            isApproved: false,
            registrationDate: '2023-07-12T11:00:00'
          }
        ];
        
        setUsers(sampleUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        Sentry.captureException(error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApprove = async (userId) => {
    try {
      // This would call the API to approve the hairdresser
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (error) {
      console.error('Error approving user:', error);
      Sentry.captureException(error);
      alert('Failed to approve user');
    }
  };

  const handleBlock = async (userId) => {
    try {
      // This would call the API to block the user
      alert(`User ${userId} would be blocked`);
    } catch (error) {
      console.error('Error blocking user:', error);
      Sentry.captureException(error);
      alert('Failed to block user');
    }
  };

  const filteredUsers = users.filter(user => {
    // Apply type filter
    if (filter !== 'all' && user.type !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-900 mr-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-indigo-900">User Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input sm:w-40"
              >
                <option value="all">All Users</option>
                <option value="client">Clients Only</option>
                <option value="hairdresser">Hairdressers Only</option>
              </select>
              
              <input
                type="text"
                placeholder="Search users..."
                className="input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.type === 'hairdresser'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.type === 'hairdresser' ? 'Hairdresser' : 'Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.type === 'hairdresser' ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isApproved ? 'Approved' : 'Pending Approval'}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.registrationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer">
                          View
                        </button>
                        
                        {user.type === 'hairdresser' && !user.isApproved && (
                          <button 
                            className="text-green-600 hover:text-green-900 mr-3 cursor-pointer"
                            onClick={() => handleApprove(user.id)}
                          >
                            Approve
                          </button>
                        )}
                        
                        <button 
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={() => handleBlock(user.id)}
                        >
                          Block
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Salon App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}