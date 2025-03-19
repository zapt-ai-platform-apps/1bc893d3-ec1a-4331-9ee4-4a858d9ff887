import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import PersonalInfoForm from './registration/PersonalInfoForm';
import TermsAgreement from './registration/TermsAgreement';
import RegistrationSuccess from './registration/RegistrationSuccess';
import * as Sentry from '@sentry/browser';

export default function ClientRegistrationFlow() {
  const { user, session, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    hasAcceptedTerms: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handlePersonalInfoSubmit = async (data) => {
    try {
      setFormData({ ...formData, ...data });
      
      // Save personal info to database
      const response = await fetch('/api/users/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save personal information');
      }
      
      // Move to terms agreement step
      setCurrentStep(2);
      navigate('/register/client/terms');
    } catch (error) {
      console.error('Error saving personal info:', error);
      Sentry.captureException(error);
      alert('An error occurred while saving your information. Please try again.');
    }
  };

  const handleTermsSubmit = async (accepted) => {
    try {
      setFormData({ ...formData, hasAcceptedTerms: accepted });
      
      // Save terms acceptance to database
      const response = await fetch('/api/users/client-accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          hasAcceptedTerms: accepted
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save terms acceptance');
      }
      
      // Refresh user profile
      await refreshProfile();
      
      // Move to success step
      setCurrentStep(3);
      navigate('/register/client/success');
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      Sentry.captureException(error);
      alert('An error occurred while saving your terms acceptance. Please try again.');
    }
  };

  const handleComplete = () => {
    navigate('/client');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=96&height=96" 
            alt="Logo" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-indigo-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Client Registration</p>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-indigo-600 text-white' 
                    : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : step}
              </div>
              <span className={`text-xs mt-1 ${step === currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                {step === 1 ? 'Details' : step === 2 ? 'Terms' : 'Complete'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Routes>
            <Route 
              path="/personal-info" 
              element={<PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />} 
            />
            <Route 
              path="/terms" 
              element={<TermsAgreement onSubmit={handleTermsSubmit} />} 
            />
            <Route 
              path="/success" 
              element={<RegistrationSuccess onComplete={handleComplete} />} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}