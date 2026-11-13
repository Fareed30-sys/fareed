import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Select } from '../common/Select';

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Advisory Reports' },
    { value: 'crop', label: 'Crop Recommendations' },
    { value: 'soil', label: 'Soil Health Reports' },
    { value: 'fertilizer', label: 'Fertilizer Advisories' },
    { value: 'irrigation', label: 'Irrigation Plans' },
    { value: 'disease', label: 'Pest & Disease Reports' },
    { value: 'calendar', label: 'Cultivation Calendars' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reports by crop name, symptoms, location..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500"
        />
      </div>

      <div className="w-full sm:w-56">
        <Select
          options={typeOptions}
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="text-xs py-2"
        />
      </div>
    </div>
  );
};

