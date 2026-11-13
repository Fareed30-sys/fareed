/**
 * AI Agricultural Chatbot Prompt Generator
 * Section 15.G & 4.I
 */

export const generateChatPrompt = ({ message, history = [], userProfile = {}, language = 'en' }) => {
  const languageInstructions = {
    en: 'Respond in English.',
    kn: 'Respond in Kannada (ಕನ್ನಡ). Use polite, accessible farmer terminology.',
    hi: 'Respond in Hindi (हिन्दी).',
    te: 'Respond in Telugu (తెలుగు).',
    ta: 'Respond in Tamil (தமிழ்).',
    ur: 'Respond in Urdu (اردو).',
    ml: 'Respond in Malayalam (മലയാളം).',
  };

  const langDirective = languageInstructions[language] || languageInstructions.en;

  const profileSummary = userProfile
    ? `FARMER PROFILE CONTEXT:
- Name: ${userProfile.full_name || 'Farmer'}
- Region: ${userProfile.district ? `${userProfile.district}, ` : ''}${userProfile.state || 'India'}
- Land: ${userProfile.land_area ? `${userProfile.land_area} ${userProfile.land_unit || 'acre'}` : 'Not specified'}
- Irrigation Available: ${userProfile.irrigation_available ? 'Yes' : 'Rainfed / Unknown'}`
    : 'No prior profile context available.';

  const formattedHistory = history
    .map((msg) => `${msg.role === 'user' ? 'Farmer' : 'AgroAI'}: ${msg.content}`)
    .join('\n');

  return `
${profileSummary}

RECENT CONVERSATION HISTORY:
${formattedHistory || 'No previous messages in this conversation.'}

LATEST FARMER QUESTION / MESSAGE:
Farmer: "${message}"

LANGUAGE DIRECTIVE:
${langDirective}

STRICT JSON SCHEMA REQUIREMENT:
Return a JSON object strictly matching this structure:
{
  "answer": "Clear, practical, empathetic agricultural answer explaining principles, precautions, and actionable advice.",
  "language": "${language}",
  "relatedTopics": ["2 to 4 related agricultural topics the farmer can ask next, e.g. 'Drip irrigation setup', 'Foliar spray timing'"],
  "warnings": ["Agricultural safety warnings, weather contingencies, or chemical precautions if applicable"],
  "requiresExpertConsultation": false
}
`;
};

