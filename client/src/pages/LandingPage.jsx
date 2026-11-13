import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarCheck,
  BotMessageSquare,
  ShieldCheck,
  Languages,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: Sprout,
      title: 'Precision Crop Recommendation',
      description:
        'AI engine evaluates regional climate, season (Kharif, Rabi, Zaid), soil type, and pH to recommend the highest yielding crops with suitability scores.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: FlaskConical,
      title: 'Soil Health & Fertility Diagnostics',
      description:
        'Enter laboratory test values or field observations to assess N-P-K balances, organic carbon, pH status, and soil improvement techniques.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Wheat,
      title: 'Balanced Fertilizer Advisory',
      description:
        'Integrated Nutrient Management (INM) plans matching crop growth stages, split application schedules, and soil conditioning guidelines.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation Scheduling',
      description:
        'Water conservation schedules based on soil texture, evapotranspiration rates, crop critical stages, and visual water stress indicators.',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: Bug,
      title: 'Pest & Disease Differential Diagnosis',
      description:
        'Symptom-based phytosanitary assessment and optional photo inspection with Integrated Pest Management (IPM) and safe, non-restricted guidelines.',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      icon: CalendarCheck,
      title: 'Dynamic Cultivation Calendars',
      description:
        'Chronological roadmap from land prep to harvest. Interactive milestones allowing farmers to monitor and check off farming operations.',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Farm & Soil Data',
      desc: 'Submit your district, soil type, season, and measured test values or field observations.',
    },
    {
      number: '02',
      title: 'AI Rigorous Analysis',
      desc: 'Google Gemini analyzes agricultural parameters against scientific agronomic knowledge.',
    },
    {
      number: '03',
      title: 'Receive Actionable Advisory',
      desc: 'Get clear, understandable guidance with suitability scores, biological warnings, and next steps.',
    },
    {
      number: '04',
      title: 'Track & Ask Follow-ups',
      desc: 'Save calendars, monitor upcoming activities, and converse in Kannada, Hindi, or English.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-agro-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agro-100/80 border border-agro-200 text-agro-800 text-xs font-bold tracking-wide shadow-sm">
            <Languages className="w-3.5 h-3.5 text-agro-600" />
            <span>Multilingual Support: English • ಕನ್ನಡ • हिन्दी • More</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
            Smart Farming Starts with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-600 via-emerald-600 to-agro-800">
              Smarter Decisions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-agro-600/25">
                {user ? 'Go to Farmer Dashboard' : t('hero.getStarted')}
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t('hero.exploreFeatures')}
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-agro-600" /> Row-Level Security Protected
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agro-600" /> Responsible AI Disclaimers
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-agro-600" /> India & Global Agro-Climatic Zones
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-agro-600 bg-agro-50 px-3 py-1 rounded-full border border-agro-100">
            Simple 4-Step Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How AgroAI Empowers Your Cultivation
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            From entering your field observations to structured scientific guidance in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="relative p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-agro-200 block mb-4">
                  {st.number}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{st.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-agro-600 bg-agro-50 px-3 py-1 rounded-full border border-agro-100">
            Intelligent Advisory Modules
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Every Agricultural Tool You Need
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Built from scratch to support farmers, agricultural educators, and agronomists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-agro-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FARMER BENEFITS & CATEGORIES */}
      <section id="domains" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-agro-50/60 to-white py-16 rounded-3xl border border-agro-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-agro-700">
              Why Farmers Choose AgroAI
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Responsible, Science-Backed Agricultural Support
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-agro-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">No Fabricated Soil Data</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    AgroAI strictly marks unmeasured nutrients as unknown, preventing disastrous over-fertilization advice.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-agro-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Regional Language Fluency</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Explanations generated directly in Kannada (ಕನ್ನಡ), Hindi, and English so every farming household can read recommendations with ease.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-agro-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Integrated Pest Management (IPM)</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Recommends eco-friendly cultural, biological, and non-restricted treatments with standard personal protective gear precautions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Supported Agricultural Domains
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <strong className="block text-gray-800 font-bold mb-1">Crops</strong>
                <p className="text-gray-500 text-[11px]">
                  Rice, Wheat, Ragi, Cotton, Sugarcane, Pulses, Vegetables & Millets
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <strong className="block text-gray-800 font-bold mb-1">Soils</strong>
                <p className="text-gray-500 text-[11px]">
                  Red sandy loam, Black Vertisol, Alluvial, Laterite, Clayey
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <strong className="block text-gray-800 font-bold mb-1">Seasons</strong>
                <p className="text-gray-500 text-[11px]">
                  Kharif (Monsoon), Rabi (Winter), Zaid (Summer)
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <strong className="block text-gray-800 font-bold mb-1">Irrigation</strong>
                <p className="text-gray-500 text-[11px]">
                  Drip, Sprinkler, Furrow, Rainfed water management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-agro-900 to-agro-950 p-8 sm:p-14 rounded-3xl text-white space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Farming Decisions?
          </h2>
          <p className="text-xs sm:text-sm text-agro-200 max-w-xl mx-auto leading-relaxed">
            Create your free farmer account today, record your farms, and generate personalized AI advisories in your language.
          </p>
          <div className="pt-2">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button size="lg" className="bg-white text-agro-950 hover:bg-agro-50 shadow-none">
                {user ? 'Open Dashboard' : 'Get Started Free'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

