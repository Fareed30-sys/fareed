import React from 'react';

export const NutrientStatusCard = ({ label, status = 'unknown', value }) => {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'adequate':
      case 'optimal':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          badge: 'Adequate',
        };
      case 'low':
      case 'deficient':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          badge: 'Deficient / Low',
        };
      case 'high':
      case 'excess':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          badge: 'High / Excess',
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-500 border-gray-200',
          dot: 'bg-gray-400',
          badge: 'Not Tested',
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`p-4 rounded-2xl border ${style.bg} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold">
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          {style.badge}
        </span>
      </div>
      {value !== undefined && value !== null && (
        <p className="text-lg font-black mt-2">{value}</p>
      )}
    </div>
  );
};

