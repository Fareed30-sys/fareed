/**
 * Crop Recommendation Prompt Generator
 * Section 15.A
 */

export const generateCropPrompt = (input) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for explanations, reasons, risks, and next steps, keeping crop common names clear.',
    hi: 'Respond in Hindi (हिन्दी) for explanations, reasons, risks, and next steps.',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Analyze the following farmer's land and regional parameters to recommend the most suitable crops:

LOCATION & REGION:
- State: ${input.state}
- District: ${input.district}
- Cultivation Season: ${input.season}

LAND & SOIL DATA:
- Soil Type: ${input.soilType}
- Land Area: ${input.landArea} ${input.landUnit}
- Irrigation Availability: ${input.irrigationAvailable ? 'Available' : 'Rainfed / Not available'}
- Measured Soil pH: ${input.soilPH !== undefined && input.soilPH !== null ? input.soilPH : 'Not provided / Unknown'}
- Nitrogen (N): ${input.nitrogen !== undefined && input.nitrogen !== null ? `${input.nitrogen} kg/ha or mg/kg` : 'Not tested'}
- Phosphorus (P): ${input.phosphorus !== undefined && input.phosphorus !== null ? `${input.phosphorus} kg/ha or mg/kg` : 'Not tested'}
- Potassium (K): ${input.potassium !== undefined && input.potassium !== null ? `${input.potassium} kg/ha or mg/kg` : 'Not tested'}
- Organic Carbon: ${input.organicCarbon !== undefined && input.organicCarbon !== null ? `${input.organicCarbon}%` : 'Not tested'}

WEATHER & CLIMATE OBSERVATIONS (if known):
- Temperature: ${input.temperature !== undefined && input.temperature !== null ? `${input.temperature} °C` : 'Historical seasonal average'}
- Humidity: ${input.humidity !== undefined && input.humidity !== null ? `${input.humidity}%` : 'Not provided'}
- Rainfall: ${input.rainfall !== undefined && input.rainfall !== null ? `${input.rainfall} mm` : 'Not provided'}

PREFERENCES & HISTORY:
- Preferred Crop Category: ${input.preferredCategory || 'Any suitable'}
- Previous Crop Grown: ${input.previousCrop || 'None reported'}

LANGUAGE DIRECTIVE:
${langDirective}

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "summary": "Comprehensive overview of agro-climatic conditions for this farm",
  "dataLimitations": ["List any missing data points that would improve accuracy, e.g. Soil testing lab report"],
  "recommendations": [
    {
      "cropName": "Crop name (e.g. Finger Millet / Ragi)",
      "suitabilityScore": 88,
      "suitabilityLevel": "high",
      "reason": "Detailed justification of why this crop fits the soil and season",
      "soilCompatibility": "Detailed analysis of compatibility with the soil type and pH",
      "climateCompatibility": "Analysis of compatibility with the season and climate",
      "waterRequirement": "Low / Moderate / High with details",
      "estimatedDurationDays": 115,
      "sowingPeriod": "Recommended sowing window for this district",
      "risks": ["Potential pest/disease risk or weather vulnerability"],
      "nextSteps": ["Immediate actionable preparation advice"]
    }
  ],
  "warnings": ["Agricultural safety warning, market volatility notice, or weather caveat"],
  "expertConsultationRequired": false
}

Note: suitabilityScore must be an integer between 0 and 100 representing advisory suitability index (not scientific probability).
`;
};

