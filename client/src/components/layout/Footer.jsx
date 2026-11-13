import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-agro-600 flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-gray-900">
                Agro<span className="text-agro-600">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Empowering farmers with practical, location-aware, AI-driven crop intelligence and nutrient planning.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Advisories
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/crop-recommendation" className="hover:text-agro-600">
                  Crop Recommendation
                </Link>
              </li>
              <li>
                <Link to="/soil-analysis" className="hover:text-agro-600">
                  Soil Health Analysis
                </Link>
              </li>
              <li>
                <Link to="/fertilizer-advisory" className="hover:text-agro-600">
                  Fertilizer Management
                </Link>
              </li>
              <li>
                <Link to="/irrigation-advisory" className="hover:text-agro-600">
                  Irrigation Scheduling
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/disease-detection" className="hover:text-agro-600">
                  Pest & Disease Diagnosis
                </Link>
              </li>
              <li>
                <Link to="/cultivation-calendar" className="hover:text-agro-600">
                  Cultivation Calendars
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-agro-600">
                  Multilingual AI Chatbot
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Supabase RLS Protected
                </span>
              </li>
            </ul>
          </div>

          {/* Indian Agricultural Disclaimer */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
            <h4 className="text-xs font-bold text-gray-800 mb-1">Notice to Farmers</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Always cross-reference automated advice with your local Agricultural Officer, KVK, or State Agricultural University. AgroAI does not guarantee yields.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} AgroAI Platform. Built for Indian & Global Agriculture.</p>
          <p className="flex items-center gap-1">
            Dedicated to farmers everywhere <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

