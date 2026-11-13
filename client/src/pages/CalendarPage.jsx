import React, { useState, useEffect } from 'react';
import {
  generateCalendar,
  getCalendars,
  updateCalendarActivities,
  deleteCalendar,
} from '../services/api';
import { CultivationTimeline } from '../components/agriculture/CultivationTimeline';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorState } from '../components/common/ErrorState';
import { CalendarDays, Plus, Trash2, CalendarCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { format } from 'date-fns';

export const CalendarPage = () => {
  const { language } = useLanguage();
  const [calendars, setCalendars] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // New Calendar Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    crop: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    farmingType: 'Standard',
  });

  useEffect(() => {
    loadCalendars();
  }, []);

  const loadCalendars = async () => {
    try {
      setIsLoading(true);
      const res = await getCalendars();
      const list = res.data?.items || [];
      setCalendars(list);
      if (list.length > 0) {
        setActiveCalendar(list[0]);
      } else {
        setIsFormOpen(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load calendars.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.crop.trim()) {
      alert('Please enter a crop name');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const res = await generateCalendar({
        ...formData,
        language: language || 'en',
      });
      const created = res.data;
      setCalendars((prev) => [created, ...prev]);
      setActiveCalendar(created);
      setIsFormOpen(false);
      setFormData({
        crop: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        farmingType: 'Standard',
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate cultivation timeline.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleActivity = async (index) => {
    if (!activeCalendar || isUpdating) return;

    const updatedActivities = activeCalendar.activities.map((act, i) => {
      if (i === index) {
        return { ...act, completed: !act.completed };
      }
      return act;
    });

    // Optimistic state update
    const updatedCal = { ...activeCalendar, activities: updatedActivities };
    setActiveCalendar(updatedCal);
    setCalendars((prev) =>
      prev.map((c) => (c.id === updatedCal.id ? updatedCal : c))
    );

    try {
      setIsUpdating(true);
      await updateCalendarActivities(activeCalendar.id, {
        activities: updatedActivities,
      });
    } catch (err) {
      console.error('[UPDATE_CALENDAR_ERROR]', err);
      // Revert if error
      loadCalendars();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCalendar = async (id) => {
    if (!window.confirm('Delete this cultivation timeline?')) return;
    try {
      await deleteCalendar(id);
      const remaining = calendars.filter((c) => c.id !== id);
      setCalendars(remaining);
      setActiveCalendar(remaining[0] || null);
      if (remaining.length === 0) setIsFormOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading cultivation calendars..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-purple-600" />
            <span>Crop Cultivation Calendar & Milestone Tracker</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Phased schedules from land preparation to harvest with interactive activity tracking.
          </p>
        </div>

        <Button
          size="sm"
          icon={Plus}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Close Form' : 'New Cultivation Plan'}
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={loadCalendars} />}

      {/* Generator Form */}
      {isFormOpen && (
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Create New Cultivation Schedule
            </h2>
            <p className="text-xs text-gray-500">
              Set sowing date and crop to generate chronological agrotechnical milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Crop to Cultivate"
              required
              placeholder="e.g. Rice (Paddy), Finger Millet (Ragi), Groundnut"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
            />

            <Input
              label="Planned Sowing / Transplanting Date"
              required
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <Select
              label="Farming Practice"
              options={['Standard', 'Organic / ICM', 'Zero Budget Natural Farming (ZBNF)']}
              value={formData.farmingType}
              onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isGenerating}
              icon={Sparkles}
              size="sm"
            >
              Generate AI Cultivation Schedule
            </Button>
          </div>
        </form>
      )}

      {/* Calendar Switcher Tabs */}
      {calendars.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {calendars.map((cal) => (
            <div
              key={cal.id}
              onClick={() => setActiveCalendar(cal)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer text-xs font-bold transition-all border shrink-0 ${
                activeCalendar?.id === cal.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{cal.crop_name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCalendar(cal.id);
                }}
                className={`p-1 rounded-md hover:bg-black/10 transition-colors ${
                  activeCalendar?.id === cal.id ? 'text-white' : 'text-gray-400'
                }`}
                title="Delete calendar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Cultivation Timeline */}
      {activeCalendar ? (
        <CultivationTimeline
          calendar={activeCalendar}
          onToggleActivity={handleToggleActivity}
          isUpdating={isUpdating}
        />
      ) : (
        !isFormOpen && (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-gray-400 text-xs">
            No cultivation schedules found. Click "New Cultivation Plan" above to create one.
          </div>
        )
      )}
    </div>
  );
};

