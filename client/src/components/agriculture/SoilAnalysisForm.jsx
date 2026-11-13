import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { SOIL_TYPES } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';
import { FlaskConical } from 'lucide-react';

export const SoilAnalysisForm = ({ onSubmit, isLoading, farms = [] }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    farmId: '',
    soilType: 'Red Soil / Red Sandy Loam',
    soilPH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicCarbon: '',
    electricalConductivity: '',
    micronutrients: '',
    additionalObservations: '',
    language: language || 'en',
  });

  const [errors, setErrors] = useState({});

  const handleFarmSelect = (e) => {
    const selectedFarmId = e.target.value;
    const farm = farms.find((f) => f.id === selectedFarmId);
    if (farm) {
      setFormData((prev) => ({
        ...prev,
        farmId: farm.id,
        soilType: farm.soil_type || prev.soilType,
        soilPH: farm.soil_ph || prev.soilPH,
      }));
    } else {
      setFormData((prev) => ({ ...prev, farmId: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.soilType) {
      setErrors({ soilType: 'Soil type is required' });
      return;
    }

    const payload = {
      ...formData,
      soilPH: formData.soilPH ? Number(formData.soilPH) : null,
      nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
      phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
      potassium: formData.potassium ? Number(formData.potassium) : null,
      organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
      electricalConductivity: formData.electricalConductivity
        ? Number(formData.electricalConductivity)
        : null,
      language: language || 'en',
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Soil Laboratory & Field Data</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter available Soil Health Card or lab values. Missing parameters can be left empty.
          </p>
        </div>

        {farms.length > 0 && (
          <div className="w-48 sm:w-56">
            <Select
              placeholder="Load farm data..."
              options={farms.map((f) => ({ value: f.id, label: f.farm_name }))}
              value={formData.farmId}
              onChange={handleFarmSelect}
              className="text-xs py-1.5"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <Select
            label="Soil Type / Physical Texture"
            required
            options={SOIL_TYPES}
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            error={errors.soilType}
          />
        </div>

        <Input
          label="Soil pH (0 - 14)"
          type="number"
          step="0.1"
          min="0"
          max="14"
          name="soilPH"
          placeholder="e.g. 6.5"
          value={formData.soilPH}
          onChange={handleChange}
          helperText="Ideal range is 6.5 - 7.5"
        />

        <Input
          label="Organic Carbon (%)"
          type="number"
          step="0.01"
          name="organicCarbon"
          placeholder="e.g. 0.45"
          value={formData.organicCarbon}
          onChange={handleChange}
          helperText="High: > 0.75%, Low: < 0.5%"
        />
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Primary Nutrients (NPK)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Available Nitrogen (N)"
            type="number"
            step="0.1"
            name="nitrogen"
            placeholder="kg/ha or ppm"
            value={formData.nitrogen}
            onChange={handleChange}
          />
          <Input
            label="Available Phosphorus (P)"
            type="number"
            step="0.1"
            name="phosphorus"
            placeholder="kg/ha or ppm"
            value={formData.phosphorus}
            onChange={handleChange}
          />
          <Input
            label="Available Potassium (K)"
            type="number"
            step="0.1"
            name="potassium"
            placeholder="kg/ha or ppm"
            value={formData.potassium}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Electrical Conductivity - EC (dS/m)"
          type="number"
          step="0.01"
          name="electricalConductivity"
          placeholder="e.g. 0.8"
          value={formData.electricalConductivity}
          onChange={handleChange}
          helperText="Indicates soil salinity level"
        />

        <Input
          label="Micronutrients (Zinc, Boron, Iron, etc.)"
          name="micronutrients"
          placeholder="e.g. Zn: 0.6 ppm, B: 0.4 ppm"
          value={formData.micronutrients}
          onChange={handleChange}
        />
      </div>

      <Textarea
        label="Physical Field Observations / Visual Notes"
        name="additionalObservations"
        placeholder="e.g. Soil has white salt crust during summer, poor drainage after rain, hardpan below 6 inches"
        rows={3}
        value={formData.additionalObservations}
        onChange={handleChange}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          icon={FlaskConical}
          size="lg"
          className="w-full sm:w-auto"
        >
          Analyze Soil Health & Fertility
        </Button>
      </div>
    </form>
  );
};

