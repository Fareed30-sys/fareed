import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-agro-50 text-agro-600 border border-agro-100 flex items-center justify-center shadow-sm">
        <Sprout className="w-8 h-8" />
      </div>

      <span className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight">
        404
      </span>

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        Agricultural Plot Not Found
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
        The page or advisory report you are looking for does not exist or has been moved.
      </p>

      <div className="pt-2 flex gap-3">
        <Link to="/">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="sm" icon={Home}>
            Farmer Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

