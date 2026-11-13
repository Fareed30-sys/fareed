import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  Calendar,
  Trash2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

export const AdvisoryHistoryCard = ({ item, onDelete, isDeleting }) => {
  const getMeta = (type) => {
    switch (type) {
      case 'crop':
        return {
          icon: Sprout,
          color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          title: item.recommendations?.recommendations?.[0]?.cropName
            ? `Crop Advisory: ${item.recommendations.recommendations[0].cropName}`
            : 'Crop Recommendation',
          subtitle: `Season: ${item.input_data?.season || 'Seasonal'} • ${item.input_data?.district || 'General'}`,
          link: `/history/${item.id}?type=crop`,
        };
      case 'soil':
        return {
          icon: FlaskConical,
          color: 'bg-amber-50 text-amber-600 border-amber-100',
          title: `Soil Analysis: ${item.soil_data?.soilType || 'Soil Health'}`,
          subtitle: `pH: ${item.soil_data?.soilPH ?? 'N/A'} • Status: ${item.analysis?.soilPHStatus || 'Assessed'}`,
          link: `/history/${item.id}?type=soil`,
        };
      case 'fertilizer':
        return {
          icon: Wheat,
          color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          title: `Fertilizer Guide: ${item.crop_name}`,
          subtitle: `Stage: ${item.input_data?.growthStage || 'Cultivation'}`,
          link: `/history/${item.id}?type=fertilizer`,
        };
      case 'irrigation':
        return {
          icon: Droplets,
          color: 'bg-sky-50 text-sky-600 border-sky-100',
          title: `Irrigation Schedule: ${item.crop_name}`,
          subtitle: `Water Req: ${item.advisory?.waterRequirement || 'Calculated'}`,
          link: `/history/${item.id}?type=irrigation`,
        };
      case 'disease':
        return {
          icon: Bug,
          color: 'bg-rose-50 text-rose-600 border-rose-100',
          title: `Diagnostic: ${item.crop_name}`,
          subtitle: `Condition: ${item.analysis?.possibleConditions?.[0]?.name || 'Analyzed'}`,
          link: `/history/${item.id}?type=disease`,
        };
      case 'calendar':
        return {
          icon: Calendar,
          color: 'bg-purple-50 text-purple-600 border-purple-100',
          title: `Cultivation Calendar: ${item.crop_name}`,
          subtitle: `Tasks: ${item.activities?.length || 0} scheduled milestones`,
          link: `/history/${item.id}?type=calendar`,
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-50 text-gray-600 border-gray-100',
          title: 'Advisory Record',
          subtitle: 'Generated Report',
          link: `/history/${item.id}`,
        };
    }
  };

  const meta = getMeta(item.itemType || item.type);
  const Icon = meta.icon;
  const createdAt = item.created_at ? new Date(item.created_at) : new Date();

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${meta.color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 truncate">{meta.title}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
              {item.itemType || item.type}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{meta.subtitle}</p>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {format(createdAt, 'PPP • p')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <Link
          to={meta.link}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agro-50 hover:bg-agro-100 text-agro-700 rounded-xl text-xs font-bold transition-colors"
        >
          <span>View Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {onDelete && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(item.id, item.itemType || item.type)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            title="Delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

