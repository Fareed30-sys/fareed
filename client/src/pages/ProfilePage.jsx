import React, { useState, useEffect } from 'react';
import {
  getProfile,
  updateProfile,
  getFarms,
  createFarm,
  deleteFarm,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { LoadingScreen } from '../components/common/LoadingScreen';
import {
  User,
  MapPin,
  Building2,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';
import {
  INDIAN_STATES_DISTRICTS,
  LAND_UNITS,
  FARMING_TYPES,
  SUPPORTED_LANGUAGES,
  SOIL_TYPES,
  IRRIGATION_METHODS,
} from '../utils/constants';

export const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    country: 'India',
    state: 'Karnataka',
    district: 'Mandya',
    village: '',
    preferredLanguage: 'en',
    farmingExperience: 0,
    landArea: 0,
    landUnit: 'acre',
    farmingType: 'Conventional (Chemical + Tillage)',
    irrigationAvailable: true,
  });

  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // New farm modal
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [newFarm, setNewFarm] = useState({
    farmName: '',
    location: '',
    state: 'Karnataka',
    district: 'Mandya',
    soilType: 'Red Soil / Red Sandy Loam',
    soilPH: 6.5,
    landArea: 2,
    landUnit: 'acre',
    irrigationMethod: 'Drip Irrigation',
  });
  const [farmLoading, setFarmLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profRes, farmRes] = await Promise.all([getProfile(), getFarms()]);

      if (profRes.data) {
        setProfileData({
          fullName: profRes.data.full_name || '',
          phone: profRes.data.phone || '',
          country: profRes.data.country || 'India',
          state: profRes.data.state || 'Karnataka',
          district: profRes.data.district || 'Mandya',
          village: profRes.data.village || '',
          preferredLanguage: profRes.data.preferred_language || 'en',
          farmingExperience: profRes.data.farming_experience || 0,
          landArea: profRes.data.land_area || 0,
          landUnit: profRes.data.land_unit || 'acre',
          farmingType: profRes.data.farming_type || 'Conventional (Chemical + Tillage)',
          irrigationAvailable: profRes.data.irrigation_available ?? true,
        });
      }

      setFarms(farmRes.data || []);
    } catch (err) {
      console.error('[LOAD_PROFILE_ERROR]', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    setProfileData((prev) => ({
      ...prev,
      state: newState,
      district: districts[0] || '',
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateProfile({
        ...profileData,
        farmingExperience: Number(profileData.farmingExperience) || 0,
        landArea: Number(profileData.landArea) || 0,
      });
      await refreshProfile();
      setSuccessMsg('Farmer profile saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    setFarmLoading(true);

    try {
      const res = await createFarm({
        ...newFarm,
        landArea: Number(newFarm.landArea),
        soilPH: newFarm.soilPH ? Number(newFarm.soilPH) : null,
      });
      setFarms((prev) => [res.data, ...prev]);
      setIsFarmModalOpen(false);
      setNewFarm({
        farmName: '',
        location: '',
        state: 'Karnataka',
        district: 'Mandya',
        soilType: 'Red Soil / Red Sandy Loam',
        soilPH: 6.5,
        landArea: 2,
        landUnit: 'acre',
        irrigationMethod: 'Drip Irrigation',
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create farm');
    } finally {
      setFarmLoading(false);
    }
  };

  const handleDeleteFarm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return;
    try {
      await deleteFarm(id);
      setFarms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete farm');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading farmer profile records..." />;
  }

  const availableDistricts = INDIAN_STATES_DISTRICTS[profileData.state] || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Farmer Profile & Landholdings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Maintain your personal farming background, location, and registered parcels.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-800 font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Main Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-agro-50 text-agro-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Personal & Experience Info</h2>
            <p className="text-[11px] text-gray-400">Account Email: {user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Full Name"
            required
            name="fullName"
            value={profileData.fullName}
            onChange={handleProfileChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+91 98765 43210"
            value={profileData.phone}
            onChange={handleProfileChange}
          />

          <Select
            label="Preferred Advisory Language"
            options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.code, label: `${l.native} (${l.label})` }))}
            name="preferredLanguage"
            value={profileData.preferredLanguage}
            onChange={handleProfileChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="State"
            options={Object.keys(INDIAN_STATES_DISTRICTS)}
            value={profileData.state}
            onChange={handleStateChange}
          />

          <Select
            label="District"
            options={availableDistricts}
            name="district"
            value={profileData.district}
            onChange={handleProfileChange}
          />

          <Input
            label="Village / Locality"
            name="village"
            placeholder="e.g. Srirangapatna"
            value={profileData.village}
            onChange={handleProfileChange}
          />

          <Input
            label="Farming Experience (Years)"
            type="number"
            min="0"
            name="farmingExperience"
            value={profileData.farmingExperience}
            onChange={handleProfileChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Total Land Area"
                type="number"
                step="0.1"
                min="0"
                name="landArea"
                value={profileData.landArea}
                onChange={handleProfileChange}
              />
            </div>
            <div className="w-28">
              <Select
                options={LAND_UNITS}
                name="landUnit"
                value={profileData.landUnit}
                onChange={handleProfileChange}
              />
            </div>
          </div>

          <Select
            label="Primary Farming Practice"
            options={FARMING_TYPES}
            name="farmingType"
            value={profileData.farmingType}
            onChange={handleProfileChange}
          />

          <div className="flex flex-col justify-end">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Irrigation Facility
            </label>
            <label className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="irrigationAvailable"
                checked={profileData.irrigationAvailable}
                onChange={handleProfileChange}
                className="w-4 h-4 rounded text-agro-600 focus:ring-agro-500 border-gray-300"
              />
              <span className="text-xs font-medium text-gray-800">
                Has Borewell / Canal Irrigation
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSaving} icon={Save} size="md">
            Save Profile Updates
          </Button>
        </div>
      </form>

      {/* 2. Registered Farms Section */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Your Farm Parcels</h2>
              <p className="text-xs text-gray-500">
                Save separate plots with distinct soil types and irrigation setups
              </p>
            </div>
          </div>

          <Button
            size="sm"
            icon={Plus}
            onClick={() => setIsFarmModalOpen(true)}
          >
            Add Farm Plot
          </Button>
        </div>

        {farms.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No specific farm plots registered yet. Adding plots enables one-click pre-filling across all advisory forms.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{farm.farm_name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {farm.district}, {farm.state}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-gray-600">
                    <span className="bg-white border px-2 py-0.5 rounded-md">
                      {farm.land_area} {farm.land_unit}
                    </span>
                    <span className="bg-white border px-2 py-0.5 rounded-md">
                      {farm.soil_type || 'Unspecified soil'}
                    </span>
                    {farm.soil_ph && (
                      <span className="bg-white border px-2 py-0.5 rounded-md">
                        pH {farm.soil_ph}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteFarm(farm.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                  title="Delete farm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Farm Modal */}
      <Modal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        title="Register Farm Parcel"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateFarm} className="space-y-4">
          <Input
            label="Farm / Plot Name"
            required
            placeholder="e.g. North Canal Plot, Home Farm"
            value={newFarm.farmName}
            onChange={(e) => setNewFarm({ ...newFarm, farmName: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="State"
              options={Object.keys(INDIAN_STATES_DISTRICTS)}
              value={newFarm.state}
              onChange={(e) =>
                setNewFarm({
                  ...newFarm,
                  state: e.target.value,
                  district: INDIAN_STATES_DISTRICTS[e.target.value]?.[0] || '',
                })
              }
            />

            <Select
              label="District"
              options={INDIAN_STATES_DISTRICTS[newFarm.state] || []}
              value={newFarm.district}
              onChange={(e) => setNewFarm({ ...newFarm, district: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Soil Type"
              options={SOIL_TYPES}
              value={newFarm.soilType}
              onChange={(e) => setNewFarm({ ...newFarm, soilType: e.target.value })}
            />

            <Input
              label="Soil pH (0 - 14)"
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={newFarm.soilPH}
              onChange={(e) => setNewFarm({ ...newFarm, soilPH: e.target.value })}
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
                  value={newFarm.landArea}
                  onChange={(e) => setNewFarm({ ...newFarm, landArea: e.target.value })}
                />
              </div>
              <div className="w-28">
                <Select
                  options={LAND_UNITS}
                  value={newFarm.landUnit}
                  onChange={(e) => setNewFarm({ ...newFarm, landUnit: e.target.value })}
                />
              </div>
            </div>

            <Select
              label="Irrigation Method"
              options={IRRIGATION_METHODS}
              value={newFarm.irrigationMethod}
              onChange={(e) => setNewFarm({ ...newFarm, irrigationMethod: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFarmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={farmLoading}>
              Save Farm Parcel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

