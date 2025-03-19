import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function HairdresserHome() {
  const { user, signOut, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch upcoming appointments
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // This would be implemented to fetch real data
        // For now, we'll use sample data
        setAppointments([
          {
            id: 1,
            clientName: 'Marie Dupont',
            hairstyle: 'Braids',
            date: '2023-07-15T10:00:00',
            status: 'confirmed',
            price: 12000
          },
          {
            id: 2,
            clientName: 'Jean Mbongo',
            hairstyle: 'Fade Cut',
            date: '2023-07-16T14:30:00',
            status: 'pending',
            price: 8000
          }
        ]);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Sentry.captureException(error);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
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
            <p className="text-gray-600">Manage your appointments and services</p>
          </div>
          
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-indigo-800">Upcoming Appointments</h3>
            </div>
            
            <div className="p-4">
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
              ) : appointments.length === 0 ? (
                <div className="text-center p-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-gray-400 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-600">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mt-1">You have no scheduled appointments at this time</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hairstyle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.clientName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.hairstyle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(appointment.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.price} FCFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status === 'confirmed' ? 'Confirmed' : 
                               appointment.status === 'pending' ? 'Pending' : 'Cancelled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer">
                              View
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-900 mr-3 cursor-pointer">
                                  Accept
                                </button>
                                <button className="text-red-600 hover:text-red-900 cursor-pointer">
                                  Decline
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-indigo-800">My Hairstyles</h3>
                <button className="btn-primary text-sm">Manage</button>
              </div>
              <div className="p-4">
                <p className="text-gray-600">Add and manage the hairstyles you offer.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-indigo-800">Availability</h3>
                <button className="btn-primary text-sm">Set Hours</button>
              </div>
              <div className="p-4">
                <p className="text-gray-600">Set your working hours and availability.</p>
              </div>
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