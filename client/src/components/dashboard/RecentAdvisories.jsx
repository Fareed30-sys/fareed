import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sprout, FlaskConical, Wheat, Droplets, Bug } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentAdvisories = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'crop':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'soil':
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case 'fertilizer':
        return <Wheat className="w-4 h-4 text-indigo-600" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'disease':
        return <Bug className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-agro-600" />
          <h3 className="text-base font-bold text-gray-900">Recent Advisory Reports</h3>
        </div>
        <Link
          to="/history"
          className="text-xs font-bold text-agro-600 hover:text-agro-700 flex items-center gap-1"
        >
          <span>View All History</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs">
          <p>No advisories generated yet.</p>
          <Link
            to="/crop-recommendation"
            className="text-agro-600 font-bold hover:underline mt-1 inline-block"
          >
            Get your first crop recommendation →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.map((act) => (
            <Link
              key={`${act.type}-${act.id}`}
              to={act.link}
              className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {getIcon(act.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-agro-600 transition-colors">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{act.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400">
                  {act.date
                    ? formatDistanceToNow(new Date(act.date), { addSuffix: true })
                    : 'Recent'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

