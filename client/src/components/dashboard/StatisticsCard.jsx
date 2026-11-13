import React from 'react';
import {
  FileText,
  Sprout,
  FlaskConical,
  CalendarCheck,
  Building2,
  Droplets,
} from 'lucide-react';

export const StatisticsCard = ({ metrics = {} }) => {
  const stats = [
    {
      label: 'Total Reports',
      value: metrics.totalAdvisories ?? 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Crop Advisories',
      value: metrics.cropRecommendations ?? 0,
      icon: Sprout,
      color: 'bg-agro-50 text-agro-600 border-agro-100',
    },
    {
      label: 'Soil Reports',
      value: metrics.soilHealthReports ?? 0,
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Active Calendars',
      value: metrics.activePlans ?? 0,
      icon: CalendarCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      label: 'Irrigation Plans',
      value: metrics.irrigationAdvisories ?? 0,
      icon: Droplets,
      color: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      label: 'Registered Farms',
      value: metrics.savedFarms ?? 0,
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${stat.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

