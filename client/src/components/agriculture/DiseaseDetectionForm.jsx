import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { ImageUploader } from './ImageUploader';
import { PLANT_PARTS } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';
import { Bug, Sparkles } from 'lucide-react';

export const DiseaseDetectionForm = ({ onSubmit, isLoading, farms = [] }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    farmId: '',
    crop: '',
    affectedPart: 'Leaves',
    duration: '',
    symptoms: '',
    visibleDamage: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = {};
    if (!formData.crop.trim()) errs.crop = 'Crop name is required';
    if (!formData.affectedPart) errs.affectedPart = 'Affected plant part is required';
    if (!formData.duration.trim()) errs.duration = 'Duration of problem is required';
    if (!formData.symptoms.trim() || formData.symptoms.trim().length < 5) {
      errs.symptoms = 'Please describe symptoms in at least 5 characters';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Construct FormData for multipart API call
    const data = new FormData();
    data.append('crop', formData.crop.trim());
    data.append('affectedPart', formData.affectedPart);
    data.append('duration', formData.duration.trim());
    data.append('symptoms', formData.symptoms.trim());
    if (formData.farmId) data.append('farmId', formData.farmId);
    if (formData.visibleDamage) data.append('visibleDamage', formData.visibleDamage.trim());
    data.append('language', language || 'en');

    if (imageFile) {
      data.append('image', imageFile);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Crop Health Diagnostic Request</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Describe symptoms and optionally attach a photo for differential diagnosis
          </p>
        </div>

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
          label="Affected Crop"
          required
          placeholder="e.g. Tomato, Cotton, Paddy, Maize"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          error={errors.crop}
        />

        <Select
          label="Affected Plant Part"
          required
          options={PLANT_PARTS}
          name="affectedPart"
          value={formData.affectedPart}
          onChange={handleChange}
          error={errors.affectedPart}
        />

        <Input
          label="Duration of Problem"
          required
          placeholder="e.g. 3 days, 1 week, since flowering"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          error={errors.duration}
        />
      </div>

      <Textarea
        label="Observed Symptoms & Color Discoloration"
        required
        placeholder="e.g. Brown circular spots with yellow halos on lower leaves, drooping foliage during midday, white powdery coating on upper leaf surface"
        name="symptoms"
        rows={3}
        value={formData.symptoms}
        onChange={handleChange}
        error={errors.symptoms}
      />

      <Input
        label="Visible Insects, Damage or Pests (Optional)"
        placeholder="e.g. Tiny green aphids under leaf, stem bore hole with frass, caterpillars"
        name="visibleDamage"
        value={formData.visibleDamage}
        onChange={handleChange}
      />

      <ImageUploader
        onFileSelect={(file) => setImageFile(file)}
        selectedFile={imageFile}
        onRemoveFile={() => setImageFile(null)}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          icon={Bug}
          size="lg"
          className="w-full sm:w-auto"
        >
          Diagnose Crop Disease & Pest Issue
        </Button>
      </div>
    </form>
  );
};

