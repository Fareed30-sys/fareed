import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const UpcomingTasks = ({ tasks = [], onToggleTask }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-agro-600" />
          <h3 className="text-base font-bold text-gray-900">Upcoming Farming Tasks</h3>
        </div>
        <Link
          to="/cultivation-calendar"
          className="text-xs font-bold text-agro-600 hover:text-agro-700 flex items-center gap-1"
        >
          <span>View Calendars</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs">
          <p>No active tasks scheduled.</p>
          <Link
            to="/cultivation-calendar"
            className="text-agro-600 font-bold hover:underline mt-1 inline-block"
          >
            Create a Cultivation Calendar →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-200 transition-all flex items-start gap-3"
            >
              <div className="mt-0.5">
                <span className="w-2 h-2 rounded-full bg-agro-500 block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {task.cropName} • {task.stage}
                  </p>
                  <span className="text-[10px] font-semibold text-agro-700 bg-agro-100 px-2 py-0.5 rounded-full shrink-0">
                    {task.dayRange}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

