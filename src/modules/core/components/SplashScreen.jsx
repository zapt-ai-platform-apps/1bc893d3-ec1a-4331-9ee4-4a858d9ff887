import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  useEffect(() => {
    // Lock scrolling during splash screen
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-indigo-50">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }}
          className="mb-4"
        >
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128" 
            alt="Salon App Logo" 
            className="w-24 h-24 object-contain"
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl font-bold text-indigo-700 mb-4"
        >
          Salon App
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4"
        >
          <div className="loader">
            <div></div>
            <div className="animation-delay-100"></div>
            <div className="animation-delay-200"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}