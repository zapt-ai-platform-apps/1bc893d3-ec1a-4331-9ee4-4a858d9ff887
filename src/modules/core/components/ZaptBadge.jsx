import React from 'react';

export default function ZaptBadge() {
  return (
    <a 
      href="https://www.zapt.ai" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-2 right-2 z-50 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shadow-sm hover:bg-indigo-100 transition-colors"
    >
      Made on ZAPT
    </a>
  );
}