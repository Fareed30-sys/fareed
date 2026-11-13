import React from 'react';
import { CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

export const CultivationTimeline = ({ calendar, onToggleActivity, isUpdating = false }) => {
  const { crop_name, start_date, activities = [] } = calendar;
  const startDateObj = start_date ? new Date(start_date) : new Date();

  const getImportanceBadge = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const progressPercent = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span>{crop_name}</span>
            <span className="text-xs font-semibold text-gray-400">Cultivation Timeline</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-agro-600" />
            Started: <strong>{format(startDateObj, 'PPP')}</strong>
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Progress
            </p>
            <p className="text-xs font-bold text-gray-900">
              {completedCount} of {activities.length} completed ({progressPercent}%)
            </p>
          </div>
          <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-agro-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
        {activities.map((act, index) => {
          const approxDateStart = addDays(startDateObj, act.dayFromStart);
          const approxDateEnd = addDays(startDateObj, act.dayToStart);

          return (
            <div key={index} className="relative group">
              {/* Checkbox Icon Marker on Line */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onToggleActivity && onToggleActivity(index)}
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-all ${
                  act.completed
                    ? 'border-agro-600 text-agro-600 bg-agro-50'
                    : 'border-gray-300 text-transparent hover:border-agro-400'
                }`}
                title={act.completed ? 'Mark as incomplete' : 'Mark as completed'}
              >
                <CheckCircle2 className={`w-4 h-4 ${act.completed ? 'block' : 'opacity-0 group-hover:opacity-50 text-gray-400'}`} />
              </button>

              {/* Task Content Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  act.completed
                    ? 'bg-gray-50/50 border-gray-200 opacity-80'
                    : 'bg-white border-gray-200 hover:border-agro-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <h4
                    className={`text-sm font-bold ${
                      act.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {act.stage}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-500">
                      Day {act.dayFromStart} - {act.dayToStart} ({format(approxDateStart, 'MMM d')} - {format(approxDateEnd, 'MMM d')})
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getImportanceBadge(
                        act.importance
                      )}`}
                    >
                      {act.importance}
                    </span>
                  </div>
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    act.completed ? 'text-gray-400' : 'text-gray-700 font-medium'
                  }`}
                >
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

