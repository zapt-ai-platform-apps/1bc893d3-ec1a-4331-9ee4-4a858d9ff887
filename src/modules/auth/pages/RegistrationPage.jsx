import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';
import { motion } from 'framer-motion';

export default function RegistrationPage() {
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });
      
      if (error) throw error;
      
      console.log('Registration successful, user type:', userType);
      
      // Redirect to the appropriate registration flow
      if (userType === 'client') {
        navigate('/register/client/personal-info');
      } else if (userType === 'hairdresser') {
        navigate('/register/hairdresser/personal-info');
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      Sentry.captureException(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=96&height=96" 
            alt="Logo" 
            className="mx-auto h-16 w-16 mb-4"
          />
          <h1 className="text-2xl font-bold text-indigo-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join the Salon App community</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        {!userType ? (
          <div className="space-y-5">
            <h2 className="text-lg font-medium text-center mb-4">I am a:</h2>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('client')}
              className="block w-full py-4 px-6 bg-white border-2 border-indigo-100 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer mb-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4 p-2 bg-indigo-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Client</h3>
                  <p className="text-gray-500 text-sm">Book appointments with hairdressers</p>
                </div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('hairdresser')}
              className="block w-full py-4 px-6 bg-white border-2 border-indigo-100 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4 p-2 bg-indigo-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Hairdresser</h3>
                  <p className="text-gray-500 text-sm">Offer your services and manage appointments</p>
                </div>
              </div>
            </motion.button>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Create a secure password"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : 'Create Account'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                ← Back to user type selection
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            By signing up, you agree to our 
            <a href="#" className="text-indigo-600 hover:text-indigo-800 ml-1">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}