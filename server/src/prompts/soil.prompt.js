/**
 * Soil Health Analysis Prompt Generator
 * Section 15.B
 */

export const generateSoilPrompt = (input) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for explanations, assessments, and practices.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Conduct a thorough, scientific yet practical soil health assessment based on the provided laboratory test data or physical field observations:

SOIL PARAMETERS:
- Soil Type / Texture: ${input.soilType}
- Soil pH: ${input.soilPH !== undefined && input.soilPH !== null ? input.soilPH : 'Not tested'}
- Available Nitrogen (N): ${input.nitrogen !== undefined && input.nitrogen !== null ? `${input.nitrogen} kg/ha or ppm` : 'Not tested'}
- Available Phosphorus (P): ${input.phosphorus !== undefined && input.phosphorus !== null ? `${input.phosphorus} kg/ha or ppm` : 'Not tested'}
- Available Potassium (K): ${input.potassium !== undefined && input.potassium !== null ? `${input.potassium} kg/ha or ppm` : 'Not tested'}
- Organic Carbon (OC): ${input.organicCarbon !== undefined && input.organicCarbon !== null ? `${input.organicCarbon}%` : 'Not tested'}
- Electrical Conductivity (EC): ${input.electricalConductivity !== undefined && input.electricalConductivity !== null ? `${input.electricalConductivity} dS/m` : 'Not tested'}
- Micronutrients: ${input.micronutrients || 'Not tested'}
- Farmer Field Observations: ${input.additionalObservations || 'None provided'}

LANGUAGE DIRECTIVE:
${langDirective}

STRICT COMPLIANCE RULES:
- Do not invent missing lab numbers. If a nutrient was not tested, set status to 'unknown'.
- Determine soilPHStatus accurately: strongly_acidic (< 5.5), acidic (5.5 - 6.5), neutral (6.6 - 7.5), alkaline (7.6 - 8.5), strongly_alkaline (> 8.5), or unknown.
- Recommend soil amendments (gypsum for alkali, lime for acid, organic compost for low OC).

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "overallAssessment": "Comprehensive summary of soil fertility and physical condition",
  "soilPHStatus": "neutral",
  "nutrientAssessment": {
    "nitrogen": "adequate | low | high | unknown",
    "phosphorus": "adequate | low | high | unknown",
    "potassium": "adequate | low | high | unknown",
    "organicCarbon": "adequate | low | high | unknown"
  },
  "potentialDeficiencies": ["Specific nutrient deficiencies identified from data"],
  "potentialExcesses": ["Specific excesses or toxicities if detected"],
  "suitableCrops": ["Crops naturally thriving in this soil environment"],
  "improvementPractices": ["Actionable regenerative or soil improvement practices (e.g. green manuring, vermicompost)"],
  "additionalTestingRequired": ["Specific tests recommended to complete the picture"],
  "warnings": ["Precautions regarding salinity, over-fertilization, or pH extremes"]
}
`;
};

