import React, { useState, useEffect } from 'react';
import { analyzeSoil, getFarms } from '../services/api';
import { SoilAnalysisForm } from '../components/agriculture/SoilAnalysisForm';
import { SoilHealthCard } from '../components/agriculture/SoilHealthCard';
import { ErrorState } from '../components/common/ErrorState';
import { FlaskConical, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const SoilAnalysisPage = () => {
  const [farms, setFarms] = useState([]);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFarms()
      .then((res) => setFarms(res.data || []))
      .catch((err) => console.warn(err));
  }, []);

  const handleAnalyze = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await analyzeSoil(formData);
      setReport(res.data);
    } catch (err) {
      console.error('[SOIL_ANALYSIS_ERROR]', err);
      setError(err.message || 'Failed to analyze soil parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <FlaskConical className="w-7 h-7 text-amber-600" />
          <span>Soil Health & Fertility Diagnostics</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Evaluate laboratory Soil Health Card parameters, NPK availability, and identify organic amendments.
        </p>
      </div>

      {error && (
        <ErrorState
          title="Soil Diagnostic Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      <SoilAnalysisForm
        onSubmit={handleAnalyze}
        isLoading={isLoading}
        farms={farms}
      />

      {report && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Diagnostic Assessment Report
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setReport(null)}
            >
              Analyze Another Sample
            </Button>
          </div>

          <SoilHealthCard report={report} />
        </div>
      )}
    </div>
  );
};

