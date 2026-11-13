/**
 * Irrigation Advisory Prompt Generator
 * Section 15.D
 */

export const generateIrrigationPrompt = (input) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for explanations, methods, and advice.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Formulate a tailored water management and irrigation advisory based on the following agro-hydrological data:

CROP & FIELD CONDITIONS:
- Crop: ${input.crop}
- Growth Stage: ${input.growthStage}
- Soil Type: ${input.soilType}
- Field Area: ${input.landArea} ${input.landUnit}
- Irrigation Method Used: ${input.irrigationMethod}
- Water Availability: ${input.waterAvailability}

WEATHER & MOISTURE CONTEXT:
- Recent Rainfall: ${input.lastRainfall || 'No recent rainfall reported'}
- Temperature: ${input.temperature !== undefined && input.temperature !== null ? `${input.temperature} °C` : 'Seasonal ambient'}
- Humidity: ${input.humidity !== undefined && input.humidity !== null ? `${input.humidity}%` : 'Not provided'}

LANGUAGE DIRECTIVE:
${langDirective}

RULES:
- When real-time tensiometer or automated soil moisture sensor data is missing, note that irrigation timings are estimates.
- Address water stress indicators (temporary wilting vs permanent wilting point).
- Emphasize water-use efficiency (mulching, nocturnal irrigation to curb evapotranspiration).
- Address critical growth stages where moisture stress causes irreversible yield penalties.

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "cropName": "${input.crop}",
  "growthStage": "${input.growthStage}",
  "waterRequirement": "Estimated daily or weekly requirement (e.g. 4-5 mm/day or Moderate)",
  "irrigationRecommendations": [
    {
      "timing": "Recommended timing (e.g. Every 4-5 days, prefer early morning or late evening)",
      "method": "Recommended efficient method (e.g. Alternate furrow, sub-surface drip, micro-sprinkler)",
      "reason": "Physiological rationale relating to current root depth and evapotranspiration rate"
    }
  ],
  "waterConservationMethods": ["Practical conservation practices such as organic straw mulching, bund repair"],
  "waterStressIndicators": ["Visual plant symptoms indicating underwatering (leaf rolling) or waterlogging (yellowing)"],
  "drainageAdvice": ["Advice on preventing root rot and oxygen deprivation in heavy soils"],
  "dataLimitations": ["Notice that advice is estimated in absence of physical soil moisture probes"],
  "warnings": ["Over-irrigation hazards, salinity build-up risks, or frost/heat wave mitigation"]
}
`;
};

