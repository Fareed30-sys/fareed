import React from 'react';
import {
  Droplets,
  Clock,
  Waves,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { AdvisoryWarning } from '../common/AdvisoryWarning';

export const IrrigationAdvisoryCard = ({ advisoryData }) => {
  const { crop_name, advisory = {} } = advisoryData;
  const {
    cropName = crop_name,
    growthStage,
    waterRequirement,
    irrigationRecommendations = [],
    waterConservationMethods = [],
    waterStressIndicators = [],
    drainageAdvice = [],
    dataLimitations = [],
    warnings = [],
  } = advisory;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-sm shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Crop Irrigation & Water Management Advisory
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Crop: <strong className="text-gray-900">{cropName}</strong> • Stage:{' '}
              <span className="font-semibold text-sky-600">{growthStage}</span>
            </p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-right">
          <p className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
            Water Requirement
          </p>
          <p className="text-xs font-black text-sky-950">{waterRequirement}</p>
        </div>
      </div>

      {/* Recommended Irrigation Schedules */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Optimal Irrigation Schedule & Technique
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {irrigationRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-sky-100 bg-sky-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-xs font-bold text-sky-950">{rec.timing}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {rec.reason}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-sky-100 text-[11px] text-sky-800 font-semibold flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" /> Method: {rec.method}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Stress Indicators & Drainage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {waterStressIndicators.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Plant Moisture Stress Indicators
            </h4>
            <ul className="space-y-1">
              {waterStressIndicators.map((ind, i) => (
                <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {drainageAdvice.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-500" /> Drainage & Waterlogging Prevention
            </h4>
            <ul className="space-y-1">
              {drainageAdvice.map((dr, i) => (
                <li key={i} className="text-xs text-blue-900 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{dr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Water Conservation Techniques */}
      {waterConservationMethods.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" /> Water Conservation & Moisture Retention Tips
          </h4>
          <ul className="space-y-1">
            {waterConservationMethods.map((m, i) => (
              <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notice & Limitations */}
      <AdvisoryWarning
        warnings={warnings}
        dataLimitations={dataLimitations}
        customTitle="Soil Moisture & Sensor Caveat"
      />
    </div>
  );
};

