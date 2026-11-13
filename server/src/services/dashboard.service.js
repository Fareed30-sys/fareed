/**
 * Farmer Dashboard Service
 * Section 4.L
 * Aggregates live database statistics for the authenticated farmer
 */

export const getDashboardSummaryService = async (userId, supabase) => {
  // Query counts concurrently across all tables
  const [
    cropRecsRes,
    soilReportsRes,
    fertAdvisoriesRes,
    irrigAdvisoriesRes,
    diseaseReportsRes,
    calendarsRes,
    farmsRes,
    chatsRes,
    profileRes,
  ] = await Promise.all([
    supabase.from('crop_recommendations').select('id', { count: 'exact', head: true }),
    supabase.from('soil_reports').select('id', { count: 'exact', head: true }),
    supabase.from('fertilizer_advisories').select('id', { count: 'exact', head: true }),
    supabase.from('irrigation_advisories').select('id', { count: 'exact', head: true }),
    supabase.from('disease_reports').select('id', { count: 'exact', head: true }),
    supabase.from('cultivation_calendars').select('id, crop_name, activities, start_date, created_at'),
    supabase.from('farms').select('id, farm_name, land_area, land_unit, state, district'),
    supabase.from('chat_conversations').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*').eq('id', userId).single(),
  ]);

  const cropRecsCount = cropRecsRes.count || 0;
  const soilReportsCount = soilReportsRes.count || 0;
  const fertAdvisoriesCount = fertAdvisoriesRes.count || 0;
  const irrigAdvisoriesCount = irrigAdvisoriesRes.count || 0;
  const diseaseReportsCount = diseaseReportsRes.count || 0;
  const totalAdvisories =
    cropRecsCount +
    soilReportsCount +
    fertAdvisoriesCount +
    irrigAdvisoriesCount +
    diseaseReportsCount;

  // Calculate profile completion percentage based on fields filled
  const profile = profileRes.data || {};
  const profileFields = [
    profile.full_name,
    profile.state,
    profile.district,
    profile.farming_experience !== undefined,
    profile.land_area,
    profile.farming_type,
  ];
  const filledFieldsCount = profileFields.filter(Boolean).length;
  const profileCompletionPercent = Math.round((filledFieldsCount / profileFields.length) * 100);

  // Extract upcoming / pending farming activities from saved calendars
  const calendars = calendarsRes.data || [];
  const upcomingTasks = [];

  calendars.forEach((cal) => {
    if (Array.isArray(cal.activities)) {
      cal.activities.forEach((act, idx) => {
        if (!act.completed) {
          upcomingTasks.push({
            calendarId: cal.id,
            cropName: cal.crop_name,
            activityIndex: idx,
            stage: act.stage,
            description: act.description,
            importance: act.importance || 'medium',
            dayRange: `Day ${act.dayFromStart} - ${act.dayToStart}`,
          });
        }
      });
    }
  });

  return {
    metrics: {
      totalAdvisories,
      cropRecommendations: cropRecsCount,
      soilHealthReports: soilReportsCount,
      fertilizerAdvisories: fertAdvisoriesCount,
      irrigationAdvisories: irrigAdvisoriesCount,
      diseaseReports: diseaseReportsCount,
      activePlans: calendars.length,
      savedFarms: (farmsRes.data || []).length,
      profileCompletionPercent,
    },
    farms: farmsRes.data || [],
    activeCalendars: calendars.slice(0, 5),
    upcomingTasks: upcomingTasks.slice(0, 6),
    recentConversations: chatsRes.data || [],
    profile: profileRes.data || null,
  };
};

export const getRecentActivitiesService = async (userId, supabase) => {
  // Fetch latest 3 items from each advisory category to form an aggregated activity feed
  const [cropRecs, soilReports, ferts, irrigs, diseases] = await Promise.all([
    supabase
      .from('crop_recommendations')
      .select('id, recommendations, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('soil_reports')
      .select('id, soil_data, analysis, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('fertilizer_advisories')
      .select('id, crop_name, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('irrigation_advisories')
      .select('id, crop_name, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('disease_reports')
      .select('id, crop_name, symptoms, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const activities = [];

  (cropRecs.data || []).forEach((item) => {
    activities.push({
      id: item.id,
      type: 'crop',
      title: 'Crop Recommendation',
      description: item.recommendations?.recommendations?.[0]
        ? `Top pick: ${item.recommendations.recommendations[0].cropName}`
        : 'Generated crop advisory',
      date: item.created_at,
      link: `/history/${item.id}?type=crop`,
    });
  });

  (soilReports.data || []).forEach((item) => {
    activities.push({
      id: item.id,
      type: 'soil',
      title: 'Soil Health Report',
      description: `Soil Type: ${item.soil_data?.soilType || 'Analyzed'}`,
      date: item.created_at,
      link: `/history/${item.id}?type=soil`,
    });
  });

  (ferts.data || []).forEach((item) => {
    activities.push({
      id: item.id,
      type: 'fertilizer',
      title: 'Fertilizer Advisory',
      description: `Nutrient plan for ${item.crop_name}`,
      date: item.created_at,
      link: `/history/${item.id}?type=fertilizer`,
    });
  });

  (irrigs.data || []).forEach((item) => {
    activities.push({
      id: item.id,
      type: 'irrigation',
      title: 'Irrigation Advisory',
      description: `Water schedule for ${item.crop_name}`,
      date: item.created_at,
      link: `/history/${item.id}?type=irrigation`,
    });
  });

  (diseases.data || []).forEach((item) => {
    activities.push({
      id: item.id,
      type: 'disease',
      title: 'Disease Diagnostic',
      description: `Analysis for ${item.crop_name}: ${item.symptoms.slice(0, 40)}...`,
      date: item.created_at,
      link: `/history/${item.id}?type=disease`,
    });
  });

  // Sort descending by date
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return activities.slice(0, 10);
};

