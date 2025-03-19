import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setMessage('Check your email for the password reset link');
    } catch (error) {
      console.error('Reset password error:', error.message);
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
          <h1 className="text-2xl font-bold text-indigo-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 text-sm text-green-600">
            {message}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
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
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Sending reset link...
              </div>
            ) : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}