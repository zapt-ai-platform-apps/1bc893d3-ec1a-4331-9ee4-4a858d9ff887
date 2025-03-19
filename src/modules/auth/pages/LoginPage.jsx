import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error.message);
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
          <h1 className="text-2xl font-bold text-indigo-900">Salon App</h1>
          <p className="text-gray-600 mt-2">Sign in with ZAPT</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
            Powered by ZAPT
          </a>
        </div>
      </div>
    </div>
  );
}