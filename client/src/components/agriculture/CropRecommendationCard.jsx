import React from 'react';
import {
  Sprout,
  Clock,
  Droplets,
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle2,
  CloudSun,
} from 'lucide-react';
import { CropSuitabilityIndicator } from './CropSuitabilityIndicator';

export const CropRecommendationCard = ({ recommendation }) => {
  const {
    cropName,
    suitabilityScore,
    suitabilityLevel,
    reason,
    soilCompatibility,
    climateCompatibility,
    waterRequirement,
    estimatedDurationDays,
    sowingPeriod,
    risks = [],
    nextSteps = [],
  } = recommendation;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-agro-50 border border-agro-100 flex items-center justify-center text-agro-600 shadow-sm shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">{cropName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Clock className="w-3 h-3 text-gray-400" /> ~{estimatedDurationDays} Days
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Droplets className="w-3 h-3 text-sky-500" /> {waterRequirement} Water
              </span>
            </div>
          </div>
        </div>

        <CropSuitabilityIndicator score={suitabilityScore} level={suitabilityLevel} />
      </div>

      {/* Main Reason / Explanation */}
      <div className="my-4">
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
          <strong className="text-gray-900 font-bold block mb-1">Agronomic Suitability Justification:</strong>
          {reason}
        </p>
      </div>

      {/* Compatibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
          <span className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Soil Compatibility
          </span>
          <p className="text-emerald-900 text-[11px] leading-relaxed">{soilCompatibility}</p>
        </div>

        <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs">
          <span className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
            <CloudSun className="w-3.5 h-3.5 text-sky-600" /> Climate Compatibility
          </span>
          <p className="text-sky-900 text-[11px] leading-relaxed">{climateCompatibility}</p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs">
          <span className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" /> Recommended Sowing
          </span>
          <p className="text-amber-900 text-[11px] leading-relaxed">{sowingPeriod}</p>
        </div>
      </div>

      {/* Risks & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
        {risks.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-orange-950 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-500" /> Potential Cultivation Risks
            </h4>
            <ul className="space-y-1">
              {risks.map((risk, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextSteps.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-agro-950 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-agro-600" /> Recommended Next Steps
            </h4>
            <ul className="space-y-1">
              {nextSteps.map((step, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-agro-600 font-bold">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

