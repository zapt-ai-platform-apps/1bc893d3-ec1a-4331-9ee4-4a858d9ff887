import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function TransactionHistory() {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // This would be implemented to fetch real data
        // For now, we'll use sample data
        const sampleTransactions = [
          {
            id: 1,
            type: 'registration',
            amount: 1500,
            platformFee: 1500,
            userName: 'Sophie Kengne',
            userType: 'hairdresser',
            paymentMethod: 'orange-money',
            reference: 'TR-12345',
            date: '2023-06-15T10:30:00'
          },
          {
            id: 2,
            type: 'appointment',
            amount: 12000,
            platformFee: 4800,
            userName: 'Jean Mbongo',
            userType: 'client',
            paymentMethod: 'mtn-money',
            reference: 'TR-23456',
            date: '2023-06-20T14:45:00'
          },
          {
            id: 3,
            type: 'registration',
            amount: 1500,
            platformFee: 1500,
            userName: 'Marie Dupont',
            userType: 'hairdresser',
            paymentMethod: 'orange-money',
            reference: 'TR-34567',
            date: '2023-07-05T09:15:00'
          },
          {
            id: 4,
            type: 'appointment',
            amount: 8000,
            platformFee: 3200,
            userName: 'Pierre Nkodo',
            userType: 'client',
            paymentMethod: 'mtn-money',
            reference: 'TR-45678',
            date: '2023-07-10T16:20:00'
          },
          {
            id: 5,
            type: 'registration',
            amount: 1500,
            platformFee: 1500,
            userName: 'Aminata Diallo',
            userType: 'hairdresser',
            paymentMethod: 'orange-money',
            reference: 'TR-56789',
            date: '2023-07-12T11:00:00'
          }
        ];
        
        setTransactions(sampleTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        Sentry.captureException(error);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session]);

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

  const getDateFilterRange = () => {
    const now = new Date();
    const ranges = {
      'today': new Date(now.setHours(0, 0, 0, 0)),
      'week': new Date(now.setDate(now.getDate() - 7)),
      'month': new Date(now.setMonth(now.getMonth() - 1)),
      'year': new Date(now.setFullYear(now.getFullYear() - 1))
    };
    return ranges[dateRange] || null;
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Apply type filter
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange !== 'all') {
      const minDate = getDateFilterRange();
      if (minDate && new Date(transaction.date) < minDate) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate totals
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalFees = filteredTransactions.reduce((sum, transaction) => sum + transaction.platformFee, 0);

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
              <h1 className="text-xl font-bold text-indigo-900">Transaction History</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input sm:w-40"
              >
                <option value="all">All Types</option>
                <option value="registration">Registration</option>
                <option value="appointment">Appointment</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input sm:w-40"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()} FCFA</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div>
                <p className="text-sm text-gray-500">Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{totalFees.toLocaleString()} FCFA</p>
              </div>
            </div>
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
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
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
                        Platform Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.reference}
                        </td>
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
                          <div>
                            {transaction.userName}
                            <span className={`ml-2 px-1.5 inline-flex text-xs leading-4 font-semibold rounded ${
                              transaction.userType === 'hairdresser'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.userType === 'hairdresser' ? 'H' : 'C'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.platformFee.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.paymentMethod === 'orange-money' ? 'Orange Money' : 'MTN Money'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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