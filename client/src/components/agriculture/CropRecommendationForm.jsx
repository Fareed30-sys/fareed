import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import {
  INDIAN_STATES_DISTRICTS,
  SOIL_TYPES,
  CROP_SEASONS,
  LAND_UNITS,
} from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const CropRecommendationForm = ({ onSubmit, isLoading, farms = [], defaultValues = {} }) => {
  const { language } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState({
    farmId: '',
    state: defaultValues.state || 'Karnataka',
    district: defaultValues.district || 'Mandya',
    soilType: defaultValues.soilType || 'Red Soil / Red Sandy Loam',
    season: 'Kharif',
    landArea: defaultValues.landArea || 2,
    landUnit: defaultValues.landUnit || 'acre',
    irrigationAvailable: defaultValues.irrigationAvailable ?? true,
    soilPH: defaultValues.soilPH || '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicCarbon: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    preferredCategory: '',
    previousCrop: '',
    language: language || 'en',
  });

  const [errors, setErrors] = useState({});

  // District options based on chosen state
  const availableDistricts = INDIAN_STATES_DISTRICTS[formData.state] || [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: districts[0] || '',
    }));
  };

  const handleFarmSelect = (e) => {
    const selectedFarmId = e.target.value;
    const farm = farms.find((f) => f.id === selectedFarmId);
    if (farm) {
      setFormData((prev) => ({
        ...prev,
        farmId: farm.id,
        state: farm.state || prev.state,
        district: farm.district || prev.district,
        soilType: farm.soil_type || prev.soilType,
        landArea: farm.land_area || prev.landArea,
        landUnit: farm.land_unit || prev.landUnit,
        soilPH: farm.soil_ph || prev.soilPH,
      }));
    } else {
      setFormData((prev) => ({ ...prev, farmId: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client validation
    const errs = {};
    if (!formData.state) errs.state = 'State is required';
    if (!formData.district) errs.district = 'District is required';
    if (!formData.soilType) errs.soilType = 'Soil type is required';
    if (!formData.season) errs.season = 'Season is required';
    if (!formData.landArea || Number(formData.landArea) <= 0) {
      errs.landArea = 'Please enter a valid land area greater than 0';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Clean up empty numerical strings to null/undefined
    const payload = {
      ...formData,
      landArea: Number(formData.landArea),
      soilPH: formData.soilPH ? Number(formData.soilPH) : null,
      nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
      phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
      potassium: formData.potassium ? Number(formData.potassium) : null,
      organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
      temperature: formData.temperature ? Number(formData.temperature) : null,
      humidity: formData.humidity ? Number(formData.humidity) : null,
      rainfall: formData.rainfall ? Number(formData.rainfall) : null,
      language: language || 'en',
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Crop Recommendation Parameters</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Fill in your farm details to get AI-powered crop selection
          </p>
        </div>

        {farms.length > 0 && (
          <div className="w-48 sm:w-56">
            <Select
              placeholder="Or load saved farm..."
              options={farms.map((f) => ({ value: f.id, label: `${f.farm_name} (${f.district || ''})` }))}
              value={formData.farmId}
              onChange={handleFarmSelect}
              className="text-xs py-1.5"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* State */}
        <Select
          label="State"
          required
          options={Object.keys(INDIAN_STATES_DISTRICTS)}
          value={formData.state}
          onChange={handleStateChange}
          error={errors.state}
        />

        {/* District */}
        <Select
          label="District"
          required
          options={availableDistricts}
          value={formData.district}
          name="district"
          onChange={handleChange}
          error={errors.district}
        />

        {/* Season */}
        <Select
          label="Cultivation Season"
          required
          options={CROP_SEASONS}
          value={formData.season}
          name="season"
          onChange={handleChange}
          error={errors.season}
        />

        {/* Soil Type */}
        <Select
          label="Soil Type"
          required
          options={SOIL_TYPES}
          value={formData.soilType}
          name="soilType"
          onChange={handleChange}
          error={errors.soilType}
        />

        {/* Land Area */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Land Area"
              required
              type="number"
              step="0.1"
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

        {/* Irrigation Availability */}
        <div className="flex flex-col justify-end">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Irrigation Water Access
          </label>
          <label className="relative flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="irrigationAvailable"
              checked={formData.irrigationAvailable}
              onChange={handleChange}
              className="w-4 h-4 rounded text-agro-600 focus:ring-agro-500 border-gray-300"
            />
            <span className="text-xs font-medium text-gray-800">
              Irrigation available (Borewell / Canal / Drip)
            </span>
          </label>
        </div>
      </div>

      {/* Advanced Soil Lab & Weather Inputs Toggle */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs font-bold text-agro-700 hover:text-agro-800 transition-colors"
        >
          <span>{showAdvanced ? 'Hide' : 'Add'} Optional Soil Test Data & Weather Observations</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-4">
            <p className="text-xs text-gray-500">
              Provide laboratory soil test numbers or weather if known. Leave blank if not tested—AgroAI will not invent numbers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Soil pH (0-14)"
                type="number"
                step="0.1"
                min="0"
                max="14"
                name="soilPH"
                placeholder="e.g. 6.8"
                value={formData.soilPH}
                onChange={handleChange}
              />
              <Input
                label="Nitrogen (N)"
                type="number"
                name="nitrogen"
                placeholder="kg/ha"
                value={formData.nitrogen}
                onChange={handleChange}
              />
              <Input
                label="Phosphorus (P)"
                type="number"
                name="phosphorus"
                placeholder="kg/ha"
                value={formData.phosphorus}
                onChange={handleChange}
              />
              <Input
                label="Potassium (K)"
                type="number"
                name="potassium"
                placeholder="kg/ha"
                value={formData.potassium}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Organic Carbon (%)"
                type="number"
                step="0.01"
                name="organicCarbon"
                placeholder="e.g. 0.55"
                value={formData.organicCarbon}
                onChange={handleChange}
              />
              <Input
                label="Preferred Crop Category"
                name="preferredCategory"
                placeholder="e.g. Pulses, Millets, Vegetables"
                value={formData.preferredCategory}
                onChange={handleChange}
              />
              <Input
                label="Previous Crop Grown"
                name="previousCrop"
                placeholder="e.g. Paddy, Cotton"
                value={formData.previousCrop}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          icon={Sparkles}
          size="lg"
          className="w-full sm:w-auto"
        >
          Generate AI Crop Recommendations
        </Button>
      </div>
    </form>
  );
};

