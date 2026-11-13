import React, { useState, useEffect } from 'react';
import {
  getCropRecommendations,
  getSoilReports,
  getFertilizerAdvisories,
  getIrrigationAdvisories,
  getDiseaseReports,
  getCalendars,
  deleteCropRecommendation,
  deleteSoilReport,
  deleteFertilizerAdvisory,
  deleteIrrigationAdvisory,
  deleteDiseaseReport,
  deleteCalendar,
} from '../services/api';
import { AdvisoryHistoryCard } from '../components/history/AdvisoryHistoryCard';
import { SearchFilter } from '../components/history/SearchFilter';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorState } from '../components/common/ErrorState';
import { History, Inbox } from 'lucide-react';

export const HistoryPage = () => {
  const [allReports, setAllReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadAllReports();
  }, []);

  const loadAllReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [crops, soils, ferts, irrigs, diseases, cals] = await Promise.all([
        getCropRecommendations({ limit: 50 }),
        getSoilReports({ limit: 50 }),
        getFertilizerAdvisories({ limit: 50 }),
        getIrrigationAdvisories({ limit: 50 }),
        getDiseaseReports({ limit: 50 }),
        getCalendars({ limit: 50 }),
      ]);

      const formatted = [
        ...(crops.data?.items || []).map((i) => ({ ...i, itemType: 'crop' })),
        ...(soils.data?.items || []).map((i) => ({ ...i, itemType: 'soil' })),
        ...(ferts.data?.items || []).map((i) => ({ ...i, itemType: 'fertilizer' })),
        ...(irrigs.data?.items || []).map((i) => ({ ...i, itemType: 'irrigation' })),
        ...(diseases.data?.items || []).map((i) => ({ ...i, itemType: 'disease' })),
        ...(cals.data?.items || []).map((i) => ({ ...i, itemType: 'calendar' })),
      ];

      // Sort descending by creation date
      formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAllReports(formatted);
    } catch (err) {
      console.error('[LOAD_HISTORY_ERROR]', err);
      setError(err.message || 'Failed to load advisory history records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;

    try {
      setDeletingId(id);
      switch (type) {
        case 'crop':
          await deleteCropRecommendation(id);
          break;
        case 'soil':
          await deleteSoilReport(id);
          break;
        case 'fertilizer':
          await deleteFertilizerAdvisory(id);
          break;
        case 'irrigation':
          await deleteIrrigationAdvisory(id);
          break;
        case 'disease':
          await deleteDiseaseReport(id);
          break;
        case 'calendar':
          await deleteCalendar(id);
          break;
        default:
          break;
      }
      setAllReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and search
  const filteredReports = allReports.filter((item) => {
    // Type match
    if (selectedType !== 'all' && item.itemType !== selectedType) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const crop = (item.crop_name || item.recommendations?.recommendations?.[0]?.cropName || '').toLowerCase();
      const symptoms = (item.symptoms || '').toLowerCase();
      const state = (item.input_data?.state || item.farms?.state || '').toLowerCase();
      const district = (item.input_data?.district || item.farms?.district || '').toLowerCase();
      const type = (item.itemType || '').toLowerCase();

      return (
        crop.includes(q) ||
        symptoms.includes(q) ||
        state.includes(q) ||
        district.includes(q) ||
        type.includes(q)
      );
    }

    return true;
  });

  if (isLoading) {
    return <LoadingScreen message="Retrieving your advisory history..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <History className="w-7 h-7 text-agro-600" />
          <span>Agricultural Advisory History</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review, search, and manage your past AI crop recommendations, soil diagnoses, and schedules.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={loadAllReports} />}

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Reports Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing {filteredReports.length} advisory records</span>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-dashed text-center space-y-2">
          <Inbox className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800">No Advisory Reports Found</h3>
          <p className="text-xs text-gray-400">
            {searchQuery
              ? 'No reports match your current search terms.'
              : 'You have not generated any advisories in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <AdvisoryHistoryCard
              key={`${report.itemType}-${report.id}`}
              item={report}
              onDelete={handleDelete}
              isDeleting={deletingId === report.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

