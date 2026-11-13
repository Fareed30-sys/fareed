import React from 'react';

export const CropSuitabilityIndicator = ({ score = 0, level = 'high' }) => {
  const getBadge = () => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-500',
          label: 'Highly Suitable',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500',
          label: 'Moderately Suitable',
        };
      case 'low':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          bar: 'bg-orange-500',
          label: 'Low Suitability',
        };
      default:
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          bar: 'bg-red-500',
          label: 'Unsuitable',
        };
    }
  };

  const badge = getBadge();

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${badge.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className="text-xs font-black text-gray-900">{score}/100</span>
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
      >
        {badge.label}
      </span>
    </div>
  );
};

