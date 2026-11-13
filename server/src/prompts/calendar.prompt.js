/**
 * Cultivation Calendar Prompt Generator
 * Section 15.F & 4.H
 */

export const generateCalendarPrompt = (input) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for stage names, descriptions, and warnings.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Construct a comprehensive, chronologically phased cultivation calendar for:

CROP & LOCATION:
- Crop: ${input.crop}
- Planting / Sowing Planned Date: ${input.startDate}
- State: ${input.state || 'India (general agro-climatic)'}
- District: ${input.district || 'General'}
- Farming Type: ${input.farmingType || 'Standard'}

LANGUAGE DIRECTIVE:
${langDirective}

STAGES TO COVER (from pre-sowing to post-harvest):
1. Land Preparation & Basal Manuring (Day 0 onwards or pre-sowing)
2. Seed Selection, Quality Check & Seed Treatment (Bio-inoculation / Trichoderma)
3. Sowing / Transplanting & Spacing
4. Germination & Gap Filling
5. Vegetative Growth & Early Weed Management
6. Nutrient Top-Dressing & Earthing Up
7. Critical Irrigation Windows
8. Pest & Disease Surveillance
9. Flowering, Pod/Fruit Setting & Moisture Protection
10. Harvesting Signs & Maturity Index
11. Post-Harvest Cleaning, Drying & Safe Storage

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "cropName": "${input.crop}",
  "estimatedDurationDays": 120,
  "activities": [
    {
      "stage": "Land Preparation",
      "dayFromStart": 0,
      "dayToStart": 7,
      "description": "Deep summer ploughing followed by incorporation of well-decomposed FYM (5 tonnes/acre).",
      "importance": "high",
      "completed": false
    },
    {
      "stage": "Seed Treatment & Sowing",
      "dayFromStart": 8,
      "dayToStart": 10,
      "description": "Treat certified seeds with Trichoderma harzianum @ 10g/kg seed to prevent seed-borne wilts.",
      "importance": "high",
      "completed": false
    }
  ],
  "importantWarnings": ["Weather dependency alert, critical pest scouting milestones"],
  "dataLimitations": ["Durations may shift by 7-10 days depending on local variety and ambient temperatures"]
}
`;
};

