import React from 'react';
import { Wheat, ShieldCheck, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { AdvisoryWarning } from '../common/AdvisoryWarning';

export const FertilizerAdvisoryCard = ({ advisoryData }) => {
  const { crop_name, advisory = {} } = advisoryData;
  const {
    cropName = crop_name,
    growthStage,
    nutrientAssessment = [],
    recommendations = [],
    safetyPrecautions = [],
    dataLimitations = [],
    warnings = [],
  } = advisory;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Integrated Fertilizer & Nutrient Advisory
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Crop: <strong className="text-gray-900">{cropName}</strong> • Growth Stage:{' '}
              <span className="font-semibold text-indigo-600">{growthStage}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stage-wise Nutrient Requirement Breakdown */}
      {nutrientAssessment.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
            Nutrient Demand at this Growth Stage
          </h4>
          <ul className="space-y-1">
            {nutrientAssessment.map((item, idx) => (
              <li key={idx} className="text-xs text-indigo-900 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Recommended Applications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    {rec.fertilizerCategory}
                  </span>
                  {rec.quantity !== null && rec.quantity !== undefined && (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {rec.quantity} {rec.quantityUnit || ''}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-800 leading-relaxed font-medium mb-3">
                  {rec.reason}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/80 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-[11px]">
                    <strong className="text-gray-700">Timing:</strong> {rec.applicationTiming}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-[11px]">
                    <strong className="text-gray-700">Method:</strong> {rec.applicationMethod}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Precautions */}
      {safetyPrecautions.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Application Safety & Soil Protection
          </h4>
          <ul className="space-y-1">
            {safetyPrecautions.map((safe, idx) => (
              <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{safe}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings & Data Limitations */}
      <AdvisoryWarning warnings={warnings} dataLimitations={dataLimitations} />
    </div>
  );
};

