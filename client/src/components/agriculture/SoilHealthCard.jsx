import React from 'react';
import {
  FlaskConical,
  Sprout,
  ShieldAlert,
  ArrowUpRight,
  ClipboardList,
  Layers,
} from 'lucide-react';
import { NutrientStatusCard } from './NutrientStatusCard';
import { AdvisoryWarning } from '../common/AdvisoryWarning';

export const SoilHealthCard = ({ report }) => {
  const { soil_data = {}, analysis = {} } = report;
  const {
    overallAssessment,
    soilPHStatus,
    nutrientAssessment = {},
    potentialDeficiencies = [],
    potentialExcesses = [],
    suitableCrops = [],
    improvementPractices = [],
    additionalTestingRequired = [],
    warnings = [],
  } = analysis;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Soil Health Diagnostics & Fertility Assessment
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Soil Type: {soil_data.soilType || 'Unspecified'} • pH:{' '}
              {soil_data.soilPH ?? 'Not tested'} ({soilPHStatus?.replace('_', ' ') || 'Unknown'})
            </p>
          </div>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
        <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
          Agronomic Soil Condition Summary
        </h4>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          {overallAssessment}
        </p>
      </div>

      {/* Primary Nutrients Matrix */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Primary Nutrient & Organic Carbon Status
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NutrientStatusCard
            label="Nitrogen (N)"
            status={nutrientAssessment.nitrogen}
            value={soil_data.nitrogen ? `${soil_data.nitrogen} kg/ha` : null}
          />
          <NutrientStatusCard
            label="Phosphorus (P)"
            status={nutrientAssessment.phosphorus}
            value={soil_data.phosphorus ? `${soil_data.phosphorus} kg/ha` : null}
          />
          <NutrientStatusCard
            label="Potassium (K)"
            status={nutrientAssessment.potassium}
            value={soil_data.potassium ? `${soil_data.potassium} kg/ha` : null}
          />
          <NutrientStatusCard
            label="Organic Carbon"
            status={nutrientAssessment.organicCarbon}
            value={soil_data.organicCarbon ? `${soil_data.organicCarbon}%` : null}
          />
        </div>
      </div>

      {/* Deficiencies & Excesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
          <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Potential Deficiencies
          </h4>
          {potentialDeficiencies.length > 0 ? (
            <ul className="space-y-1">
              {potentialDeficiencies.map((d, i) => (
                <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No critical deficiencies flagged.</p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Potential Excesses / Salinity Risks
          </h4>
          {potentialExcesses.length > 0 ? (
            <ul className="space-y-1">
              {potentialExcesses.map((e, i) => (
                <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No toxic nutrient accumulation detected.</p>
          )}
        </div>
      </div>

      {/* Suitable Crops for this soil */}
      {suitableCrops.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-agro-600" /> Crops Naturally Favored by this Soil
          </h4>
          <div className="flex flex-wrap gap-2">
            {suitableCrops.map((crop, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-agro-50 text-agro-800 text-xs font-bold rounded-xl border border-agro-200"
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Practices */}
      {improvementPractices.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
            Recommended Soil Improvement & Regeneration Practices
          </h4>
          <ul className="space-y-1.5">
            {improvementPractices.map((p, i) => (
              <li key={i} className="text-xs text-emerald-900 flex items-start gap-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional testing needed & warnings */}
      <AdvisoryWarning
        warnings={warnings}
        dataLimitations={additionalTestingRequired}
      />
    </div>
  );
};

