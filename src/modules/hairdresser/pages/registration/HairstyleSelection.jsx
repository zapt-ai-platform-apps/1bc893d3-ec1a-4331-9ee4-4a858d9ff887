import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

export default function HairstyleSelection({ onSubmit }) {
  const { session } = useAuth();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHairstyles, setSelectedHairstyles] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchHairstyles() {
      try {
        setLoading(true);
        // This would be implemented to fetch real hairstyles from the backend
        // For now, we'll use sample data
        const sampleHairstyles = [
          { id: 1, name: 'Braids', description: 'Traditional braiding styles', price: 10000 },
          { id: 2, name: 'Fade Cut', description: 'Modern fade haircut', price: 5000 },
          { id: 3, name: 'Box Braids', description: 'Box braid styles', price: 15000 },
          { id: 4, name: 'Dreadlocks', description: 'Dreadlock installation and maintenance', price: 20000 },
          { id: 5, name: 'Twists', description: 'Twist styles and variations', price: 12000 },
          { id: 6, name: 'Cornrows', description: 'Cornrow braiding patterns', price: 8000 }
        ];
        
        setHairstyles(sampleHairstyles);
      } catch (error) {
        console.error('Error fetching hairstyles:', error);
        Sentry.captureException(error);
        setError('Failed to load hairstyles');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHairstyles();
  }, [session]);

  const handleHairstyleToggle = (hairstyleId) => {
    setSelectedHairstyles(prev => {
      if (prev.some(item => item.id === hairstyleId)) {
        return prev.filter(item => item.id !== hairstyleId);
      } else {
        const hairstyle = hairstyles.find(h => h.id === hairstyleId);
        return [...prev, { 
          id: hairstyleId, 
          price: hairstyle.price // Use default price initially
        }];
      }
    });
  };

  const handlePriceChange = (hairstyleId, price) => {
    setSelectedHairstyles(prev => 
      prev.map(item => 
        item.id === hairstyleId 
          ? { ...item, price: Number(price) } 
          : item
      )
    );
  };

  const handleImageUpload = (hairstyleId, files) => {
    if (files.length === 0) return;
    
    // Check file size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert('Each file size should not exceed 5MB');
        return;
      }
    }
    
    // Create image previews
    const imageUrls = [];
    const fileReaders = [];
    
    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader();
      fileReaders.push(fileReader);
      
      fileReader.onload = (e) => {
        imageUrls.push(e.target.result);
        
        // When all files are read
        if (imageUrls.length === files.length) {
          setPortfolioImages(prev => ({
            ...prev,
            [hairstyleId]: [...(prev[hairstyleId] || []), ...imageUrls]
          }));
        }
      };
      
      fileReader.readAsDataURL(files[i]);
    }
  };

  const removeImage = (hairstyleId, index) => {
    setPortfolioImages(prev => ({
      ...prev,
      [hairstyleId]: prev[hairstyleId].filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = async () => {
    if (selectedHairstyles.length === 0) {
      alert('Please select at least one hairstyle');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, we would upload images to a storage service
      // For now, we'll just pass the data to the parent component
      await onSubmit({
        selectedHairstyles,
        portfolioImages
      });
    } catch (error) {
      console.error('Error submitting hairstyles:', error);
      Sentry.captureException(error);
      alert('An error occurred while saving your selections. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
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
      <div className="text-center py-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Hairstyles You Offer</h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose the hairstyles you provide and set your prices. You can also add portfolio images for each style.
      </p>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {hairstyles.map((hairstyle) => {
          const isSelected = selectedHairstyles.some(item => item.id === hairstyle.id);
          const selectedItem = selectedHairstyles.find(item => item.id === hairstyle.id);
          
          return (
            <div 
              key={hairstyle.id} 
              className={`border rounded-lg p-4 transition-colors ${
                isSelected ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id={`hairstyle-${hairstyle.id}`}
                  checked={isSelected}
                  onChange={() => handleHairstyleToggle(hairstyle.id)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded mt-1"
                />
                <div className="ml-3 flex-1">
                  <label htmlFor={`hairstyle-${hairstyle.id}`} className="block text-sm font-medium text-gray-900">
                    {hairstyle.name}
                  </label>
                  <p className="text-sm text-gray-500">{hairstyle.description}</p>
                  
                  {isSelected && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor={`price-${hairstyle.id}`} className="block text-sm font-medium text-gray-700">
                          Your Price (FCFA)
                        </label>
                        <input
                          type="number"
                          id={`price-${hairstyle.id}`}
                          value={selectedItem.price}
                          onChange={(e) => handlePriceChange(hairstyle.id, e.target.value)}
                          className="input mt-1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Portfolio Images (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {portfolioImages[hairstyle.id]?.map((imageUrl, index) => (
                            <div key={index} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
                              <img 
                                src={imageUrl} 
                                alt={`Portfolio ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(hairstyle.id, index)}
                                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          
                          <label 
                            htmlFor={`portfolio-${hairstyle.id}`}
                            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </label>
                          <input
                            id={`portfolio-${hairstyle.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(hairstyle.id, e.target.files)}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Add photos of your work for this style</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          className="btn-primary w-full"
          onClick={handleSubmitForm}
          disabled={isSubmitting || selectedHairstyles.length === 0}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : 'Continue to Step 3'}
        </button>
        
        {selectedHairstyles.length === 0 && (
          <p className="text-sm text-red-500 mt-2 text-center">
            Please select at least one hairstyle to continue
          </p>
        )}
      </div>
    </div>
  );
}