import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateCalendarPrompt } from '../prompts/calendar.prompt.js';
import { cultivationCalendarResponseSchema } from '../schemas/calendar.schema.js';

export const generateCultivationCalendarService = async (userId, inputData, supabase) => {
  const prompt = generateCalendarPrompt(inputData);
  const calendarData = await generateGeminiStructuredContent(
    prompt,
    cultivationCalendarResponseSchema
  );

  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    crop_name: inputData.crop,
    start_date: inputData.startDate,
    activities: calendarData.activities,
  };

  const { data, error } = await supabase
    .from('cultivation_calendars')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_CALENDAR_ERROR]', error);
    throw new Error(`Failed to save cultivation calendar: ${error.message}`);
  }

  return { ...data, calendarMetadata: calendarData };
};

export const getCultivationCalendarsService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('cultivation_calendars')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve cultivation calendars: ${error.message}`);
  }

  return { items: data, total: count };
};

export const getCultivationCalendarByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('cultivation_calendars')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Cultivation calendar not found or access denied: ${error.message}`);
  }

  return data;
};

export const updateCultivationCalendarActivitiesService = async (id, userId, activities, supabase) => {
  const { data, error } = await supabase
    .from('cultivation_calendars')
    .update({ activities })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update cultivation calendar: ${error.message}`);
  }

  return data;
};

export const deleteCultivationCalendarService = async (id, userId, supabase) => {
  const { error } = await supabase
    .from('cultivation_calendars')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete cultivation calendar: ${error.message}`);
  }

  return true;
};

