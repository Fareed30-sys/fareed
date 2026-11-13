/**
 * Crop Disease & Pest Advisory Prompt Generator
 * Section 15.E
 */

export const generateDiseasePrompt = (input, hasImage = false) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ) for explanations, symptoms, IPM, and safety guidance.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[input.language] || languageInstructions.en;

  return `
Conduct a diagnostic evaluation of reported crop symptoms and potential phytosanitary issues:

FIELD REPORT:
- Crop: ${input.crop}
- Affected Plant Part: ${input.affectedPart}
- Reported Symptoms: ${input.symptoms}
- Problem Duration: ${input.duration}
- Visible Insect Activity / Physical Damage: ${input.visibleDamage || 'None noted'}
- Photographic Evidence Attached: ${hasImage ? 'Yes, plant image provided for visual review' : 'No photo uploaded; relying solely on farmer text description'}

LANGUAGE DIRECTIVE:
${langDirective}

CRITICAL AGRICULTURAL SAFETY & ETHICAL RULES:
1. NEVER declare an absolute or confirmed diagnosis based on descriptions or photos alone. Always treat findings as differential diagnoses with explicit confidence levels (low, medium, high).
2. NEVER recommend restricted, banned, or highly toxic WHO Class Ia/Ib chemical pesticides.
3. NEVER fabricate chemical dosages, dilution rates, or unapproved tank mixes. Refer farmers to registered product labels and state university package of practices.
4. Always prioritize Integrated Pest Management (IPM):
   - Cultural controls (field sanitation, rogueing diseased plants, crop rotation).
   - Biological controls (beneficial insects, Trichoderma, Pseudomonas, neem oil/NSKE).
   - Mechanical controls (yellow/blue sticky traps, pheromone traps).
5. Always recommend consultation with the nearest Krishi Vigyan Kendra (KVK), Raitha Samparka Kendra (RSK), or certified agricultural extension officer for severe outbreaks.

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "cropName": "${input.crop}",
  "possibleConditions": [
    {
      "name": "Possible disease or pest name (e.g. Cercospora Leaf Spot / Tikka disease)",
      "confidenceLevel": "medium",
      "supportingSymptoms": ["Matching symptoms observed in the report"],
      "alternativeCauses": ["Alternative physiological disorders (e.g. zinc deficiency) or other pathogens that exhibit similar lesions"],
      "recommendedInspection": ["Specific visual field checks to perform on the underside of leaves or stem collar"]
    }
  ],
  "preventiveMeasures": ["Preventive cultural practices to halt spread to adjoining plots"],
  "integratedPestManagement": ["Eco-friendly IPM practices, biological agents, trap crops"],
  "treatmentGuidance": ["Safe, standard regulatory-compliant management steps (e.g. neem seed kernel extract, approved bio-fungicides) with safety gear"],
  "safetyWarnings": ["Personal Protective Equipment (PPE) instructions, pollinator protection, and non-spray buffer zones"],
  "expertConsultationRequired": true
}
`;
};

