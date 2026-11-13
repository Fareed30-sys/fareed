import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  BotMessageSquare,
  History,
  UserCheck,
  Settings,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/crop-recommendation', label: t('nav.cropRec'), icon: Sprout },
    { to: '/soil-analysis', label: t('nav.soilAnalysis'), icon: FlaskConical },
    { to: '/fertilizer-advisory', label: t('nav.fertilizer'), icon: Wheat },
    { to: '/irrigation-advisory', label: t('nav.irrigation'), icon: Droplets },
    { to: '/disease-detection', label: t('nav.disease'), icon: Bug },
    { to: '/cultivation-calendar', label: t('nav.calendar'), icon: CalendarDays },
    { to: '/ai-assistant', label: t('nav.assistant'), icon: BotMessageSquare, badge: 'AI' },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/profile', label: t('nav.profile'), icon: UserCheck },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-agro-600 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-gray-900 tracking-tight">
              Agro<span className="text-agro-600">AI</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Advisory Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-agro-50 text-agro-700 font-bold border-l-4 border-agro-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-agro-600" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-agro-100 text-agro-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <div className="p-2.5 rounded-xl bg-white border border-gray-200/80 text-[11px] text-gray-500">
            <p className="font-bold text-gray-700">Responsibility Notice</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Recommendations are AI-assisted estimates. Consult local KVK officers.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

