import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function HairstyleCatalog() {
  const { session } = useAuth();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState(null);

  useEffect(() => {
    async function fetchHairstyles() {
      try {
        setLoading(true);
        const response = await fetch('/api/hairstyles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch hairstyles');
        }
        
        const data = await response.json();
        setHairstyles(data);
      } catch (error) {
        console.error('Error fetching hairstyles:', error);
        Sentry.captureException(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (session) {
      fetchHairstyles();
    }
  }, [session]);

  const filteredHairstyles = hairstyles.filter(hairstyle => {
    const matchesSearch = hairstyle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         hairstyle.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter ? hairstyle.price <= priceFilter : true;
    
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="loader">
          <div></div>
          <div className="animation-delay-100"></div>
          <div className="animation-delay-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
        <button 
          className="btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search hairstyles..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select 
              className="input"
              value={priceFilter || ''}
              onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Prices</option>
              <option value="5000">Under 5,000 FCFA</option>
              <option value="10000">Under 10,000 FCFA</option>
              <option value="15000">Under 15,000 FCFA</option>
              <option value="20000">Under 20,000 FCFA</option>
            </select>
          </div>
        </div>
      </div>

      {filteredHairstyles.length === 0 ? (
        <div className="text-center p-8">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-600">No hairstyles found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHairstyles.map((hairstyle) => (
            <div key={hairstyle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {hairstyle.imageUrl ? (
                  <img 
                    src={hairstyle.imageUrl} 
                    alt={hairstyle.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-16 w-16 text-indigo-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-indigo-800">{hairstyle.name}</h3>
                <p className="text-gray-600 mt-1">{hairstyle.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-indigo-600 font-medium">{hairstyle.price} FCFA</span>
                  <button className="btn-primary text-sm">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}