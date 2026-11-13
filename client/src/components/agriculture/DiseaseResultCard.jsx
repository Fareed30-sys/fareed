import React from 'react';
import {
  Bug,
  AlertTriangle,
  ShieldCheck,
  Search,
  Sprout,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AdvisoryWarning } from '../common/AdvisoryWarning';

export const DiseaseResultCard = ({ report }) => {
  const {
    crop_name,
    symptoms,
    signedImageUrl,
    analysis = {},
  } = report;

  const {
    possibleConditions = [],
    preventiveMeasures = [],
    integratedPestManagement = [],
    treatmentGuidance = [],
    safetyWarnings = [],
    expertConsultationRequired = true,
  } = analysis;

  const getConfidenceBadge = (conf) => {
    switch (conf?.toLowerCase()) {
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm shrink-0">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Crop Health Diagnostic & Phytosanitary Analysis
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Crop: <strong className="text-gray-900">{crop_name}</strong> • Reported Symptoms: "{symptoms.slice(0, 60)}..."
            </p>
          </div>
        </div>

        {signedImageUrl && (
          <div className="relative shrink-0">
            <img
              src={signedImageUrl}
              alt="Analyzed crop specimen"
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Differential Diagnoses */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Differential Diagnoses (Possibilities Evaluated)
        </h4>

        <div className="space-y-4">
          {possibleConditions.map((cond, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span>{cond.name}</span>
                </h5>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getConfidenceBadge(
                    cond.confidenceLevel
                  )}`}
                >
                  {cond.confidenceLevel} Confidence
                </span>
              </div>

              {/* Supporting symptoms */}
              {cond.supportingSymptoms?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Matching Reported Symptoms:
                  </p>
                  <ul className="space-y-0.5">
                    {cond.supportingSymptoms.map((sym, sIdx) => (
                      <li key={sIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alternative Causes */}
              {cond.alternativeCauses?.length > 0 && (
                <div className="pt-2 border-t border-rose-100/80">
                  <p className="text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Alternative Causes to Rule Out:
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {cond.alternativeCauses.join(', ')}
                  </p>
                </div>
              )}

              {/* Recommended Field Inspection */}
              {cond.recommendedInspection?.length > 0 && (
                <div className="pt-2 border-t border-rose-100/80">
                  <p className="text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Search className="w-3 h-3 text-gray-500" /> Recommended On-Site Inspection:
                  </p>
                  <ul className="space-y-0.5">
                    {cond.recommendedInspection.map((ins, iIdx) => (
                      <li key={iIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-gray-400 font-bold">•</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* IPM and Treatment Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IPM */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" /> Integrated Pest Management (IPM)
          </h4>
          <ul className="space-y-1.5">
            {integratedPestManagement.map((ipm, idx) => (
              <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{ipm}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment Guidance */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Regulatory-Compliant Safe Management
          </h4>
          <ul className="space-y-1.5">
            {treatmentGuidance.map((treat, idx) => (
              <li key={idx} className="text-xs text-blue-900 flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{treat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preventive Measures */}
      {preventiveMeasures.length > 0 && (
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Preventive Field Sanitation & Spread Containment
          </h4>
          <ul className="space-y-1">
            {preventiveMeasures.map((prev, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-gray-400 font-bold">•</span>
                <span>{prev}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Notice and Mandatory Expert Consultation Callout */}
      <AdvisoryWarning
        warnings={safetyWarnings}
        expertRequired={expertConsultationRequired}
        customTitle="Phytopathological Diagnostic Caution"
      />
    </div>
  );
};

