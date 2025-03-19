import React from 'react';
import { useForm } from 'react-hook-form';

export default function PersonalInfoForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
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