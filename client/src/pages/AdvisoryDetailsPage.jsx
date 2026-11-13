import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  getCropRecommendationById,
  getSoilReportById,
  getFertilizerAdvisoryById,
  getIrrigationAdvisoryById,
  getDiseaseReportById,
  getCalendarById,
} from '../services/api';
import { CropRecommendationCard } from '../components/agriculture/CropRecommendationCard';
import { SoilHealthCard } from '../components/agriculture/SoilHealthCard';
import { FertilizerAdvisoryCard } from '../components/agriculture/FertilizerAdvisoryCard';
import { IrrigationAdvisoryCard } from '../components/agriculture/IrrigationAdvisoryCard';
import { DiseaseResultCard } from '../components/agriculture/DiseaseResultCard';
import { CultivationTimeline } from '../components/agriculture/CultivationTimeline';
import { AdvisoryWarning } from '../components/common/AdvisoryWarning';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorState } from '../components/common/ErrorState';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const AdvisoryDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportType = searchParams.get('type') || 'crop';

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReport();
  }, [id, reportType]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let res;
      switch (reportType) {
        case 'crop':
          res = await getCropRecommendationById(id);
          break;
        case 'soil':
          res = await getSoilReportById(id);
          break;
        case 'fertilizer':
          res = await getFertilizerAdvisoryById(id);
          break;
        case 'irrigation':
          res = await getIrrigationAdvisoryById(id);
          break;
        case 'disease':
          res = await getDiseaseReportById(id);
          break;
        case 'calendar':
          res = await getCalendarById(id);
          break;
        default:
          throw new Error('Unknown advisory report type');
      }
      setData(res.data);
    } catch (err) {
      console.error('[LOAD_REPORT_DETAIL_ERROR]', err);
      setError(err.message || 'Unable to retrieve report details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading detailed advisory record..." />;
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-agro-700 hover:text-agro-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Advisory History
        </button>
        <ErrorState message={error || 'Report not found'} onRetry={loadReport} />
      </div>
    );
  }

  const createdAt = data.created_at ? new Date(data.created_at) : new Date();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-xs font-bold text-agro-700 hover:text-agro-800 bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory History</span>
        </Link>

        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Generated on {format(createdAt, 'PPP • p')}
        </span>
      </div>

      {/* Render based on report type */}
      {reportType === 'crop' && (
        <div className="space-y-6">
          <div className="p-5 bg-agro-50 border border-agro-200 rounded-3xl text-xs sm:text-sm text-agro-950 font-medium leading-relaxed">
            <strong className="block text-agro-900 font-bold mb-1">
              Agro-Climatic Assessment Summary:
            </strong>
            {data.recommendations?.summary}
          </div>

          <div className="space-y-4">
            {(data.recommendations?.recommendations || []).map((rec, i) => (
              <CropRecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          <AdvisoryWarning
            warnings={data.recommendations?.warnings}
            dataLimitations={data.recommendations?.dataLimitations}
          />
        </div>
      )}

      {reportType === 'soil' && <SoilHealthCard report={data} />}

      {reportType === 'fertilizer' && <FertilizerAdvisoryCard advisoryData={data} />}

      {reportType === 'irrigation' && <IrrigationAdvisoryCard advisoryData={data} />}

      {reportType === 'disease' && <DiseaseResultCard report={data} />}

      {reportType === 'calendar' && (
        <CultivationTimeline calendar={data} isUpdating={false} />
      )}
    </div>
  );
};

