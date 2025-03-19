import React from 'react';
import { motion } from 'framer-motion';

export default function RegistrationSuccess({ onComplete }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>
      
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-lg leading-6 font-medium text-gray-900 mb-2"
      >
        Registration Complete!
      </motion.h3>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-sm text-gray-600 mb-6 space-y-4"
      >
        <p>
          Félicitations ! Votre compte est en cours de validation. Vous serez informé sous peu.
        </p>
        <p>
          Our team will review your profile and approve your account shortly. You'll receive a notification when your account is activated.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button
          onClick={onComplete}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}