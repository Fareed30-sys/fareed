import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';

export const WelcomeCard = ({ profile, summary }) => {
  const farmerName = profile?.full_name || 'Farmer';
  const locationText = [profile?.village, profile?.district, profile?.state]
    .filter(Boolean)
    .join(', ');

  const completionPercent = summary?.metrics?.profileCompletionPercent || 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agro-900 via-agro-800 to-agro-950 p-6 sm:p-8 text-white shadow-xl shadow-agro-950/20">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-agro-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-agro-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-agro-300" />
            <span>AI Agricultural Intelligence Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {farmerName} 👋
          </h1>

          <p className="text-agro-100/90 text-xs sm:text-sm leading-relaxed">
            {locationText ? (
              <span className="flex items-center gap-1.5 text-agro-200 font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {locationText} • {profile.land_area ? `${profile.land_area} ${profile.land_unit || 'acre'}` : 'Land unlisted'}
              </span>
            ) : (
              'Welcome to your smart farming cockpit. Enter your soil and field conditions to receive precision AI advisories.'
            )}
          </p>
        </div>

        {/* Profile Completion or Quick Action */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full md:w-auto shrink-0 flex items-center justify-between md:flex-col md:items-start gap-4">
          <div>
            <p className="text-[11px] font-semibold text-agro-200 uppercase tracking-wider">
              Profile Readiness
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-white">{completionPercent}%</span>
              <span className="text-[11px] text-agro-200">complete</span>
            </div>
            {/* Progress bar */}
            <div className="w-32 bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-agro-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {completionPercent < 80 && (
            <Link to="/profile">
              <Button size="sm" variant="secondary" className="text-xs bg-white text-agro-900 border-none">
                Complete Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

