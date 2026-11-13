import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Globe,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';

export const Navbar = ({ onToggleSidebar, isDashboard = false }) => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand or Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {isDashboard && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-agro-600 flex items-center justify-center text-white shadow-md shadow-agro-600/30 group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-1">
                  Agro<span className="text-agro-600">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] text-gray-400 font-medium -mt-1 tracking-wider uppercase">
                  Agricultural Advisory
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation for Public pages */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link to="/#features" className="hover:text-agro-600 transition-colors">
                Features
              </Link>
              <Link to="/#how-it-works" className="hover:text-agro-600 transition-colors">
                How It Works
              </Link>
              <Link to="/#domains" className="hover:text-agro-600 transition-colors">
                Crops & Soil
              </Link>
            </div>
          )}

          {/* Right actions: Language selector & Auth */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-agro-600" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full text-left px-3.5 py-2 hover:bg-agro-50 transition-colors flex items-center justify-between ${
                        language === lang.code ? 'font-bold text-agro-700 bg-agro-50/50' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-agro-100 text-agro-700 font-bold text-xs flex items-center justify-center">
                    {(profile?.full_name || user.email || 'F')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-gray-800 hidden sm:block max-w-[120px] truncate">
                    {profile?.full_name || 'Farmer'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {profile?.full_name || 'Farmer'}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-agro-50 hover:text-agro-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-agro-50 hover:text-agro-700"
                    >
                      Farmer Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-agro-50 hover:text-agro-700"
                    >
                      Account Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-gray-700 hover:text-agro-600 px-3 py-2 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-agro-600 hover:bg-agro-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-agro-600/30"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

