import React, { useState, useEffect } from 'react';
import { recommendCrop, getFarms } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CropRecommendationForm } from '../components/agriculture/CropRecommendationForm';
import { CropRecommendationCard } from '../components/agriculture/CropRecommendationCard';
import { AdvisoryWarning } from '../components/common/AdvisoryWarning';
import { ErrorState } from '../components/common/ErrorState';
import { Sprout, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const CropRecommendationPage = () => {
  const { profile } = useAuth();
  const [farms, setFarms] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFarms()
      .then((res) => setFarms(res.data || []))
      .catch((err) => console.warn(err));
  }, []);

  const handleGenerate = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await recommendCrop(formData);
      setResult(res.data);
    } catch (err) {
      console.error('[CROP_REC_ERROR]', err);
      setError(err.message || 'Failed to generate crop recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const recommendations = result?.recommendations?.recommendations || [];
  const warnings = result?.recommendations?.warnings || [];
  const limitations = result?.recommendations?.dataLimitations || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Sprout className="w-7 h-7 text-agro-600" />
          <span>Crop Suitability & Cultivation Advisory</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Analyze soil chemistry, agro-climatic region, and seasonality to recommend the highest performing crops.
        </p>
      </div>

      {error && (
        <ErrorState
          title="Recommendation Engine Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Input Form */}
      <CropRecommendationForm
        onSubmit={handleGenerate}
        isLoading={isLoading}
        farms={farms}
        defaultValues={{
          state: profile?.state,
          district: profile?.district,
          landArea: profile?.land_area,
          landUnit: profile?.land_unit,
          irrigationAvailable: profile?.irrigation_available,
        }}
      />

      {/* Results Display */}
      {result && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Generated Crop Recommendations ({recommendations.length} Suitable Crops)
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setResult(null)}
            >
              Modify Inputs
            </Button>
          </div>

          {/* AI Summary */}
          {result.recommendations?.summary && (
            <div className="p-5 bg-agro-50/80 border border-agro-200 rounded-3xl text-xs sm:text-sm text-agro-950 leading-relaxed font-medium">
              <strong className="block font-bold text-agro-900 mb-1">
                Regional Agro-Climatic Assessment:
              </strong>
              {result.recommendations.summary}
            </div>
          )}

          {/* Recommendations list */}
          <div className="space-y-5">
            {recommendations.map((rec, i) => (
              <CropRecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          {/* Scientific Warnings and Limitations */}
          <AdvisoryWarning warnings={warnings} dataLimitations={limitations} />
        </div>
      )}
    </div>
  );
};

