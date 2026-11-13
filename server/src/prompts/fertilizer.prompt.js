/**
 * Fertilizer Advisory Prompt Generator
 * Section 15.C
 */

export const generateFertilizerPrompt = (input) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for explanations, methods, and precautions.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Formulate an Integrated Nutrient Management (INM) fertilizer advisory for the following crop situation:

CROP & STAGE:
- Crop: ${input.crop}
- Variety: ${input.cropVariety || 'Standard / Desi or Hybrid'}
- Current Growth Stage: ${input.growthStage}
- Farm Area: ${input.landArea} ${input.landUnit}

NUTRIENT & SOIL CONTEXT:
- Soil Test Information: ${input.soilTestData || 'No recent soil test provided'}
- Existing / Previous Fertilizer Applications: ${input.existingFertilizerUsage || 'None reported'}
- Preferred Farming Method: ${input.farmingMethod}

LANGUAGE DIRECTIVE:
${langDirective}

SAFETY & ACCURACY RULES:
- Never recommend dangerous or incompatible chemical tank-mixes.
- If exact soil nutrient levels are unavailable, keep "quantity" as null or estimate standard recommended dose of fertilizer (RDF) clearly labeled with caveat.
- Prioritize organic soil conditioning (FYM, compost) alongside balanced inorganic sources.
- Highlight split application to prevent nitrogen volatilization and leaching.

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "cropName": "${input.crop}",
  "growthStage": "${input.growthStage}",
  "nutrientAssessment": ["Nutrient requirement breakdown for this stage, e.g. High Phosphorus needed during root establishment"],
  "recommendations": [
    {
      "fertilizerCategory": "Organic / Bio-fertilizer / Primary NPK / Secondary / Micronutrient",
      "purpose": "Specific physiological benefit to the plant",
      "applicationTiming": "Exact time (e.g. Early morning, at sowing, 25 days after sowing)",
      "applicationMethod": "Basal soil application / Top dressing / Foliar spray / Fertigation",
      "quantity": 25,
      "quantityUnit": "kg/acre (or null if insufficient data)",
      "reason": "Detailed reasoning for this choice"
    }
  ],
  "safetyPrecautions": ["Protective gear, dilution instructions, environmental safety near water sources"],
  "dataLimitations": ["Limitations due to missing soil test or variety specifics"],
  "warnings": ["Over-application warning, scorch risks, or regulatory reminders"]
}
`;
};

