import React from 'react';
import { Sprout } from 'lucide-react';

export const LoadingScreen = ({ message = 'Loading agricultural workspace...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-agro-100 flex items-center justify-center animate-pulse">
          <Sprout className="w-8 h-8 text-agro-600 animate-bounce" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-gray-800">{message}</h3>
      <p className="text-xs text-gray-500 mt-1 max-w-sm">
        Consulting agricultural knowledge base and running predictive models...
      </p>
    </div>
  );
};

