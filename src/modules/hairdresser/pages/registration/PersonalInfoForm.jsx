import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Sentry from '@sentry/browser';

export default function PersonalInfoForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
    
    setProfileImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const processSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      let profileImageUrl = null;
      
      // If there's a profile image, we'd upload it here
      // For now, we'll simulate this process
      if (profileImage) {
        try {
          // This would be implemented to upload to a storage service
          // For now, we'll just use the preview URL
          profileImageUrl = imagePreview;
        } catch (error) {
          console.error('Error uploading profile image:', error);
          Sentry.captureException(error);
          throw new Error('Failed to upload profile image');
        }
      }
      
      // Submit the data with the profile image URL
      await onSubmit({
        ...data,
        profileImageUrl
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Sentry.captureException(error);
      alert('An error occurred while submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <label htmlFor="profile-image" className="btn-secondary text-sm cursor-pointer">
            Upload Photo
          </label>
          <input 
            id="profile-image" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
        </div>
        
        <div>
          <label htmlFor="firstName" className="label">First Name</label>
          <input
            id="firstName"
            type="text"
            className={`input ${errors.firstName ? 'border-red-300' : ''}`}
            placeholder="Enter your first name"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="label">Last Name</label>
          <input
            id="lastName"
            type="text"
            className={`input ${errors.lastName ? 'border-red-300' : ''}`}
            placeholder="Enter your last name"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="label">Phone Number</label>
          <input
            id="phoneNumber"
            type="tel"
            className={`input ${errors.phoneNumber ? 'border-red-300' : ''}`}
            placeholder="Enter your phone number"
            {...register('phoneNumber', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[0-9]{8,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : 'Continue to Step 2'}
        </button>
      </div>
    </form>
  );
}