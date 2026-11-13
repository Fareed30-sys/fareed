import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateDiseasePrompt } from '../prompts/disease.prompt.js';
import { diseaseResponseSchema } from '../schemas/disease.schema.js';
import { supabaseAdmin } from '../config/supabase.js';

export const analyzeCropDiseaseService = async (userId, inputData, file, supabase) => {
  const promptText = generateDiseasePrompt(inputData, Boolean(file));
  let geminiContents;
  let storedImagePath = null;

  if (file && file.buffer) {
    // 1. Upload to Supabase Storage in user's isolated folder
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const storagePath = `${userId}/${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from('crop-images')
      .upload(storagePath, file.buffer, {
        contentType: file.verifiedMimeType || file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.warn('[STORAGE_UPLOAD_WARN] Supabase storage upload warning:', uploadError.message);
      // We will still proceed with AI diagnosis using the memory buffer
    } else {
      storedImagePath = storagePath;
    }

    // 2. Multimodal content for Gemini
    geminiContents = [
      promptText,
      {
        inlineData: {
          mimeType: file.verifiedMimeType || file.mimetype,
          data: file.buffer.toString('base64'),
        },
      },
    ];
  } else {
    geminiContents = promptText;
  }

  // 3. Generate diagnosis via Gemini
  const analysis = await generateGeminiStructuredContent(
    geminiContents,
    diseaseResponseSchema
  );

  // 4. Save to database
  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    crop_name: inputData.crop,
    symptoms: inputData.symptoms,
    image_path: storedImagePath,
    analysis: analysis,
  };

  const { data, error } = await supabase
    .from('disease_reports')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_DISEASE_REPORT_ERROR]', error);
    throw new Error(`Failed to save disease report: ${error.message}`);
  }

  // 5. If image was stored, attach a secure signed URL for viewing
  if (data.image_path) {
    try {
      const { data: signedData } = await supabase.storage
        .from('crop-images')
        .createSignedUrl(data.image_path, 3600); // 1 hour validity
      data.signedImageUrl = signedData ? signedData.signedUrl : null;
    } catch (urlErr) {
      console.warn('[SIGNED_URL_WARN]', urlErr.message);
    }
  }

  return data;
};

export const getDiseaseReportsService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('disease_reports')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve disease reports: ${error.message}`);
  }

  // Attach signed URLs for records with images
  const enriched = await Promise.all(
    (data || []).map(async (report) => {
      if (report.image_path) {
        try {
          const { data: signedData } = await supabase.storage
            .from('crop-images')
            .createSignedUrl(report.image_path, 3600);
          return { ...report, signedImageUrl: signedData?.signedUrl || null };
        } catch {
          return report;
        }
      }
      return report;
    })
  );

  return { items: enriched, total: count };
};

export const getDiseaseReportByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('disease_reports')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Disease report not found or access denied: ${error.message}`);
  }

  if (data.image_path) {
    try {
      const { data: signedData } = await supabase.storage
        .from('crop-images')
        .createSignedUrl(data.image_path, 3600);
      data.signedImageUrl = signedData?.signedUrl || null;
    } catch {
      data.signedImageUrl = null;
    }
  }

  return data;
};

export const deleteDiseaseReportService = async (id, userId, supabase) => {
  // First retrieve to delete storage object if exists
  const { data: report } = await supabase
    .from('disease_reports')
    .select('image_path')
    .eq('id', id)
    .single();

  if (report?.image_path) {
    await supabase.storage.from('crop-images').remove([report.image_path]);
  }

  const { error } = await supabase
    .from('disease_reports')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete disease report: ${error.message}`);
  }

  return true;
};

