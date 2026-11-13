import { successResponse, errorResponse } from '../utils/response.js';

export const getFarms = async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return successResponse(res, 'Farms retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

export const createFarm = async (req, res, next) => {
  try {
    const payload = {
      user_id: req.user.id,
      farm_name: req.body.farmName,
      location: req.body.location,
      state: req.body.state,
      district: req.body.district,
      soil_type: req.body.soilType,
      soil_ph: req.body.soilPH,
      land_area: req.body.landArea,
      land_unit: req.body.landUnit,
      irrigation_method: req.body.irrigationMethod,
    };

    const { data, error } = await req.supabase
      .from('farms')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, 'Farm created successfully', data, 201);
  } catch (err) {
    next(err);
  }
};

export const getFarmById = async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('farms')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    return successResponse(res, 'Farm retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

export const updateFarm = async (req, res, next) => {
  try {
    const payload = {};
    if (req.body.farmName !== undefined) payload.farm_name = req.body.farmName;
    if (req.body.location !== undefined) payload.location = req.body.location;
    if (req.body.state !== undefined) payload.state = req.body.state;
    if (req.body.district !== undefined) payload.district = req.body.district;
    if (req.body.soilType !== undefined) payload.soil_type = req.body.soilType;
    if (req.body.soilPH !== undefined) payload.soil_ph = req.body.soilPH;
    if (req.body.landArea !== undefined) payload.land_area = req.body.landArea;
    if (req.body.landUnit !== undefined) payload.land_unit = req.body.landUnit;
    if (req.body.irrigationMethod !== undefined) payload.irrigation_method = req.body.irrigationMethod;

    const { data, error } = await req.supabase
      .from('farms')
      .update(payload)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, 'Farm updated successfully', data);
  } catch (err) {
    next(err);
  }
};

export const deleteFarm = async (req, res, next) => {
  try {
    const { error } = await req.supabase
      .from('farms')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    return successResponse(res, 'Farm deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

