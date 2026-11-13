import React, { useState, useEffect } from 'react';
import { analyzeDisease, getFarms } from '../services/api';
import { DiseaseDetectionForm } from '../components/agriculture/DiseaseDetectionForm';
import { DiseaseResultCard } from '../components/agriculture/DiseaseResultCard';
import { ErrorState } from '../components/common/ErrorState';
import { Bug, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const DiseaseDetectionPage = () => {
  const [farms, setFarms] = useState([]);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFarms()
      .then((res) => setFarms(res.data || []))
      .catch((err) => console.warn(err));
  }, []);

  const handleDiagnose = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await analyzeDisease(formData);
      setReport(res.data);
    } catch (err) {
      console.error('[DISEASE_DIAGNOSTIC_ERROR]', err);
      setError(err.message || 'Failed to complete disease diagnosis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Bug className="w-7 h-7 text-rose-600" />
          <span>Crop Disease & Pest Advisory</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Perform phytosanitary symptom evaluations, observe plant health indicators, and receive Integrated Pest Management (IPM) guidelines.
        </p>
      </div>

      {error && (
        <ErrorState
          title="Diagnostic Engine Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      <DiseaseDetectionForm
        onSubmit={handleDiagnose}
        isLoading={isLoading}
        farms={farms}
      />

      {report && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Phytosanitary Diagnostic Assessment
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setReport(null)}
            >
              Analyze Another Plant
            </Button>
          </div>

          <DiseaseResultCard report={report} />
        </div>
      )}
    </div>
  );
};

