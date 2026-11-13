import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AdvisoryWarning = ({
  warnings = [],
  dataLimitations = [],
  expertRequired = false,
  customTitle,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Primary Mandatory Scientific Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-amber-900 text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            {customTitle || 'Agricultural Responsibility Notice'}
          </p>
          <p className="text-amber-800 text-xs leading-relaxed">
            {t('warnings.aiNotice')}
          </p>
        </div>
      </div>

      {/* Expert Consultation Required Callout */}
      {expertRequired && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-red-950">Expert On-Site Verification Advised</p>
            <p className="text-red-800 text-xs leading-relaxed">
              Based on the reported symptoms or critical conditions, do not apply high-risk interventions without visiting your nearest Krishi Vigyan Kendra (KVK) or Government Agricultural Extension Officer.
            </p>
          </div>
        </div>
      )}

      {/* Specific AI-detected warnings */}
      {warnings && warnings.length > 0 && (
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl">
          <p className="text-xs font-bold text-orange-950 uppercase tracking-wider mb-2">
            Specific Biological / Weather Caveats
          </p>
          <ul className="space-y-1">
            {warnings.map((warn, i) => (
              <li key={i} className="text-xs text-orange-900 flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Limitations */}
      {dataLimitations && dataLimitations.length > 0 && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
          <p className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" /> Missing Information & Limitations
          </p>
          <ul className="space-y-1">
            {dataLimitations.map((lim, i) => (
              <li key={i} className="text-xs text-blue-900 flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

