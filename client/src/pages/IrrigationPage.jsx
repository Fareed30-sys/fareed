import React, { useState, useEffect } from 'react';
import { recommendIrrigation, getFarms } from '../services/api';
import { IrrigationAdvisoryCard } from '../components/agriculture/IrrigationAdvisoryCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ErrorState } from '../components/common/ErrorState';
import {
  SOIL_TYPES,
  GROWTH_STAGES,
  LAND_UNITS,
  IRRIGATION_METHODS,
} from '../utils/constants';
import { Droplets, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const IrrigationPage = () => {
  const { language } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [advisory, setAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    farmId: '',
    crop: '',
    growthStage: 'Vegetative',
    soilType: 'Red Soil / Red Sandy Loam',
    landArea: 1,
    landUnit: 'acre',
    irrigationMethod: 'Drip',
    waterAvailability: 'Moderate',
    lastRainfall: 'None in last 7 days',
    temperature: '',
    humidity: '',
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
    if (!formData.growthStage) errs.growthStage = 'Growth stage is required';
    if (!formData.soilType) errs.soilType = 'Soil type is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await recommendIrrigation({
        ...formData,
        landArea: Number(formData.landArea) || 1,
        temperature: formData.temperature ? Number(formData.temperature) : null,
        humidity: formData.humidity ? Number(formData.humidity) : null,
        language: language || 'en',
      });
      setAdvisory(res.data);
    } catch (err) {
      console.error('[IRRIGATION_ADVISORY_ERROR]', err);
      setError(err.message || 'Failed to generate irrigation schedule.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Droplets className="w-7 h-7 text-sky-600" />
          <span>Irrigation Scheduling & Water Management</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Calculate crop water demand, interval timing, and soil moisture retention techniques.
        </p>
      </div>

      {error && (
        <ErrorState
          title="Irrigation Engine Notice"
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
          <h2 className="text-base font-bold text-gray-900">Hydrological Field Parameters</h2>
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
            label="Crop"
            required
            placeholder="e.g. Sugarcane, Banana, Groundnut"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            error={errors.crop}
          />

          <Select
            label="Growth Stage"
            required
            options={GROWTH_STAGES}
            name="growthStage"
            value={formData.growthStage}
            onChange={handleChange}
          />

          <Select
            label="Field Soil Type"
            required
            options={SOIL_TYPES}
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Irrigation Method"
            options={['Drip', 'Sprinkler', 'Flood / Furrow', 'Rainfed / Manual', 'Other']}
            name="irrigationMethod"
            value={formData.irrigationMethod}
            onChange={handleChange}
          />

          <Select
            label="Water Availability"
            options={['Abundant', 'Moderate', 'Scarce', 'Critical']}
            name="waterAvailability"
            value={formData.waterAvailability}
            onChange={handleChange}
          />

          <Input
            label="Recent Rainfall History"
            placeholder="e.g. 20mm 2 days ago, None for 2 weeks"
            name="lastRainfall"
            value={formData.lastRainfall}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ambient Temperature (°C) - Optional"
            type="number"
            step="0.1"
            placeholder="e.g. 32"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />

          <Input
            label="Relative Humidity (%) - Optional"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 65"
            name="humidity"
            value={formData.humidity}
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
            Generate Irrigation Schedule
          </Button>
        </div>
      </form>

      {/* Advisory Result */}
      {advisory && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Generated Water Management Guidance
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setAdvisory(null)}
            >
              Modify Conditions
            </Button>
          </div>

          <IrrigationAdvisoryCard advisoryData={advisory} />
        </div>
      )}
    </div>
  );
};

