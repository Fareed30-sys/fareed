/**
 * Farmer Profile Service
 * Section 4.B
 */

export const getProfileService = async (userId, supabase) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load profile: ${error.message}`);
  }

  return data;
};

export const updateProfileService = async (userId, profileData, supabase) => {
  const updatePayload = {
    full_name: profileData.fullName,
    phone: profileData.phone,
    country: profileData.country || 'India',
    state: profileData.state,
    district: profileData.district,
    village: profileData.village,
    preferred_language: profileData.preferredLanguage,
    farming_experience: profileData.farmingExperience,
    land_area: profileData.landArea,
    land_unit: profileData.landUnit,
    farming_type: profileData.farmingType,
    irrigation_available: profileData.irrigationAvailable,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updatePayload })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
};

