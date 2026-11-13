import React, { useState, useEffect } from 'react';
import { recommendFertilizer, getFarms } from '../services/api';
import { FertilizerAdvisoryCard } from '../components/agriculture/FertilizerAdvisoryCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { ErrorState } from '../components/common/ErrorState';
import { GROWTH_STAGES, LAND_UNITS } from '../utils/constants';
import { Wheat, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FertilizerPage = () => {
  const { language } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [advisory, setAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    farmId: '',
    crop: '',
    cropVariety: '',
    growthStage: 'Vegetative',
    landArea: 1,
    landUnit: 'acre',
    soilTestData: '',
    existingFertilizerUsage: '',
    farmingMethod: 'Integrated (INM)',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getFarms()
      .then((res) => setFarms(res.data || []))
      .catch((err) => console.warn(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.crop.trim()) errs.crop = 'Crop name is required';
    if (!formData.landArea || Number(formData.landArea) <= 0) {
      errs.landArea = 'Land area must be greater than 0';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await recommendFertilizer({
        ...formData,
        landArea: Number(formData.landArea),
        language: language || 'en',
      });
      setAdvisory(res.data);
    } catch (err) {
      console.error('[FERTILIZER_ADVISORY_ERROR]', err);
      setError(err.message || 'Failed to generate fertilizer guidance.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Wheat className="w-7 h-7 text-indigo-600" />
          <span>Integrated Fertilizer & Nutrient Management</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Formulate stage-specific crop nutrition, organic manure ratios, and split dosage schedules.
        </p>
      </div>

      {error && (
        <ErrorState
          title="Nutrient Advisory Notice"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Crop & Soil Context</h2>
          {farms.length > 0 && (
            <div className="w-48">
              <Select
                placeholder="Link to farm..."
                options={farms.map((f) => ({ value: f.id, label: f.farm_name }))}
                value={formData.farmId}
                name="farmId"
                onChange={handleChange}
                className="text-xs py-1.5"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Cultivated Crop"
            required
            placeholder="e.g. Paddy, Cotton, Tomato, Maize"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            error={errors.crop}
          />

          <Input
            label="Crop Variety / Hybrid (Optional)"
            placeholder="e.g. RNR 15048, BT-2"
            name="cropVariety"
            value={formData.cropVariety}
            onChange={handleChange}
          />

          <Select
            label="Current Growth Stage"
            required
            options={GROWTH_STAGES}
            name="growthStage"
            value={formData.growthStage}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Land Area"
                type="number"
                step="0.1"
                required
                min="0.1"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                error={errors.landArea}
              />
            </div>
            <div className="w-28">
              <Select
                options={LAND_UNITS}
                name="landUnit"
                value={formData.landUnit}
                onChange={handleChange}
              />
            </div>
          </div>

          <Select
            label="Nutrient Management Strategy"
            options={['Integrated (INM)', 'Organic', 'Conventional']}
            name="farmingMethod"
            value={formData.farmingMethod}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="Soil Health / Soil Test Information (Optional)"
            placeholder="e.g. Low Nitrogen, High Potassium, pH 7.2 from recent test card"
            name="soilTestData"
            rows={2}
            value={formData.soilTestData}
            onChange={handleChange}
          />

          <Textarea
            label="Existing or Basal Fertilizers Already Applied (Optional)"
            placeholder="e.g. 5 tons FYM at sowing, 50kg DAP applied 10 days ago"
            name="existingFertilizerUsage"
            rows={2}
            value={formData.existingFertilizerUsage}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            icon={Sparkles}
            size="lg"
            className="w-full sm:w-auto"
          >
            Generate Fertilizer Advisory
          </Button>
        </div>
      </form>

      {/* Advisory Result */}
      {advisory && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Formulated Nutrient Guidance
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setAdvisory(null)}
            >
              Modify Crop & Stage
            </Button>
          </div>

          <FertilizerAdvisoryCard advisoryData={advisory} />
        </div>
      )}
    </div>
  );
};

